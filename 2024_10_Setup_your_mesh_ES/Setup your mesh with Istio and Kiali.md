# Introduccion

En este taller veremos como configurar una red de servicios en nuestra arquitectura de microservicios con Istio Service Mesh, de código abierto, y configurar Kiali como interfaz Gráfica. 
Veremos los beneficios que aporta a nivel de seguridad y observabilidad. 

# Porqué un service Mesh

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

# Que es Istio

Istio es una Service Mesh de código abierto que se superpone de forma transparente a las aplicaciones distribuidas. Podemos añadirlo de forma transparente a nuestra arquitectura de microservicios para incluir todos los beneficios de un Service Mesh.

En la siguiente imagen podemos ver la arquitectura de Istio: 

![istio](images/istio-architecture.png)

* Data plane. 
* Control plane. 

Istio funciona con sidecars, un proxy que se despliega en cada contenedor de nuestros 

# Que es Kiali

Kiali es una interfaz gráfica para Istio, que interpreta los datos producidos por Istio y los muestra a través de gráficos de tráfico, gráficos de la Mesh y diagramas. Nos permite visualizar fácilmente todos los datos disponibles para nuestras aplicaciones, trazas, logs, y tambien nos ayuda a encontrar problemas en la Mesh. 

Además, a través de Kiali podremos crear con wizards de forma sencilla diferentes configuraciones de Istio. 

En la siguiente imagen se puede ver la arquitectura de Kiali, con los servicios necesarios y opcionales: 

![kiali](images/kiali-architecture.png)


# Requisitos

En este tutorial emplearemos Minikube, una herramienta de código abierto que permite crear y administrar clústeres de Kubernetes en un entorno local. 

Para ello se necesita: 

* Privilegios de administrador
* 
- Minikube 
