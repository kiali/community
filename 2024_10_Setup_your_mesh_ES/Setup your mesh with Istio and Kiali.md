# Configurando tu Service Mesh con Istio y Kiali

## Tabla de Contenidos

--

# Introduccion

En este taller veremos como configurar una red de servicios en nuestra arquitectura de microservicios con Istio Service Mesh, de código abierto, y configurar Kiali como interfaz Gráfica. 
Veremos los beneficios que aporta a nivel de seguridad y observabilidad. 

## Porqué un service Mesh

En el desarrollo tradicionales, encontramos grandes aplicaciones monoliticas donde teníamos un mismo programa que se ejecutaba la misma plataforma. Como podemos pensar en aplicaciones java web empaquetadas en un archivo .war.

En las aplicaciones de microservicios, se divide esta gran aplicacion en diferentes microservicios, donde se encargan cada uno de una funcion y se ejecutan en sus propios procesos.

Con esto, se consiguen varios beneficios: 

* Escalabilidad
* Integración de diferentes servicios
* Paralelización del desarrollo

Pero tambien, surgen nuevos problemas relacionados con esta arquitectura: 

* Se pierden las dependencias de qué servicio se comunica con cual
* Se pierde el control de la aplicación

Existen aplicaciones de más de 50 microservicios donde estos problemas cobran especial relevancia. 

Aquí es donde nos beneficia tener un Service Mesh - O malla de servicios. 
Un service mesh es una capa de infraestructura que podemos agregar a nuestras aplicaciones de microservicios, que nos permite controlar la comunicación entre servicios. Ademas, nos proporciona otros beneficios relacionados con la infraestructura (Como encriptación de las comunicaciones), para que el desarrollador se preocupe solo de la funcionalidad de la aplicación. 

Entre estos beneficios están: 

* Observabilidad: Nos proporciona datos de las comunicaciones a través de métricas, trazas distribuidas o logs de acceso. 
* Gestión de tráfico: A través de reglas de enrutado podemos controlar el flujo de tráfico aplicado en diferentes capas. 
* Seguridad: Aporta encriptación de las comunicaciones con TLS y nos permite introducir políticas y auditoría de acceso. 

![servicemesh](images/service-mesh.png)

## Que es Istio

Istio es una Service Mesh de código abierto que se superpone de forma transparente a las aplicaciones distribuidas. Podemos añadirlo de forma transparente a nuestra arquitectura de microservicios para incluir todos los beneficios de un Service Mesh.

En la siguiente imagen podemos ver la arquitectura de Istio: 

![istio](images/istio-architecture.png)

* Data plane. 
* Control plane. 

Istio funciona con sidecars, un proxy que se despliega en cada contenedor de nuestros workloads que hayamos incluido en la Mesh. Un proxy Envoy, que funciona a nivel de capa 7 en el data plane y aplica todas las politicas que hayamos configuration. 

Existe otro modo de funcionamiento de Istio llamado Ambient, en fase beta, que se comentará más adelante. 

## Que es Kiali

Kiali es una interfaz gráfica para Istio, que interpreta los datos producidos por Istio y los muestra a través de gráficos de tráfico, gráficos de la Mesh y diagramas. Nos permite visualizar fácilmente todos los datos disponibles para nuestras aplicaciones, trazas, logs, y tambien nos ayuda a encontrar problemas en la Mesh. 

Además, a través de Kiali podremos crear con wizards de forma sencilla diferentes configuraciones de Istio. 

En la siguiente imagen se puede ver la arquitectura de Kiali, con los servicios necesarios y opcionales: 

![kiali](images/kiali-architecture.png)


# Instalación paso a paso 
## Prerrequisitos

En este tutorial emplearemos Minikube, una herramienta de código abierto que permite crear y administrar clústeres de Kubernetes en un entorno local. 

Para ello se necesitarán privilegios de administrador. 

Que necesitamos descargar: 

- Descargamos la herramienta de la linea de comandos de kubernetes [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- Descargamos la última version de [minikube](https://kubernetes.io/docs/tasks/tools/#minikube)
- Descargamos un [hipervisor](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download#install-a-hypervisor) para minikube. Se puede usar Docker, podman, VistualBox...  

Si no estamos usando el driver por defecto de minikube, lo podemos configurar así: 

`minikube config set driver kvm2`

Arrancamos minikube con este comando: 

`minikube start`

Si los recursos por defecto no fueran suficientes, podemos arrancarlo con el siguiente comando: 

`minikube start --memory=16384 --cpus=4`

## Instando Istio

En esta sección, veremos cómo instalar istio en modo Sidecar. 
Istio se puede instalar de varias formas, en este caso utilizaremos la herramienta de linea de comandos istioctl.

- Descargamos [istio](https://istio.io/latest/docs/setup/additional-setup/download-istio-release/)
  
`curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.23.2 TARGET_ARCH=x86_64 sh -`
- Vamos a la carpeta descargada:
  
`cd istio-1.23.2`
- Añadimos el cliente al path (Linux):

`export PATH=$PWD/bin:$PATH`

- Instalamos istio con el perfil por defecto:

`istioctl install`

Si necesitamos pasar algun valor de configuración, lo podemos hacer con --set: 

`istioctl install --set meshConfig.accessLogFile=/dev/stdout`

Otra forma de configuración sería: 

```
cat <<EOF > ./my-config.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
spec:
  meshConfig:
    accessLogFile: /dev/stdout
EOF
```

`istioctl install -f my-config.yaml`

It is possible to list all the different profiles: 

`istioctl profile list` 

Instalaremos tambien los CRDs del Gateway API, que no estan instalados por defecto: 

`get crd gateways.gateway.networking.k8s.io &> /dev/null || \
{ kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v1.1.0" | kubectl apply -f -; }`

## Instando addons
Kiali requiere Prometheus para funcionar correctamente, por lo que lo instalaremos de la siguiente forma: 

`kubectl apply -f ${ISTIO_HOME}/samples/addons/prometheus.yaml`

Grafana y Jaeger son opcionales, pero tambien los instalaremos para ver toda la funcionalidad disponible en Kiali: 

`kubectl apply -f ${ISTIO_HOME}/samples/addons/grafana.yaml`
`kubectl apply -f ${ISTIO_HOME}/samples/addons/jaeger.yaml`

## Instalando Kiali 
La forma más sencilla de instalar Kiali es applicando el yaml de configuration que viene como un addon de Istio: 

`kubectl apply -f ${ISTIO_HOME}/samples/addons/kiali.yaml`

Esta no es la forma recomendada para instalar en entornos de producción, pero si para testing o como una forma rápida de instalar y probar. 

## Comprobando que todo esté instalado
Vamos a comprobar que tengamos todo instalado. 
Vamos a listar los despliegues, pods y servicios que tenemos en el namespace de istio (istio-system): 

`kubectl get all -n istio-system`

## Instalando una aplicación de demo: Bookinfo
...

## Aplicando configuraciones  
...

# Istio y Ambient
...
