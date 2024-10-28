# Setting Up Your Service Mesh with Istio and Kiali

## Table of Contents

1. [Introduction](#introduction)
   - [Why Use a Service Mesh](#why-use-a-service-mesh)
   - [What is Istio?](#what-is-istio)
   - [What is Kiali?](#what-is-kiali)
2. [Step-by-Step Installation](#step-by-step-installation)
   - [Prerequisites](#prerequisites)
   - [Installing Istio](#installing-istio)
   - [Installing Addons](#installing-addons)
   - [Installing Kiali](#installing-kiali)
   - [Checking Installation Status](#checking-installation-status)
   - [Deploying the Bookinfo Example Application](#deploying-the-bookinfo-example-application)
   - [Expose the Application to External Traffic](#expose-the-application-to-external-traffic)
3. [Applying Configurations](#applying-configurations)
4. [Istio Ambient](#istio-ambient)
   - [What is Istio Ambient](#what-is-istio-ambient)
   - [Installing Istio Ambient](#installing-istio-ambient)
   - [Adding Bookinfo to Ambient Mesh](#adding-bookinfo-to-ambient-mesh)
   - [Adding a Waypoint Proxy](#adding-a-waypoint-proxy)
5. [Uninstalling Istio Ambient](#uninstalling-istio-ambient)

# Introduction

In this workshop, we will explore how to configure a service mesh in our microservices architecture using the open-source Istio Service Mesh and set up Kiali as a graphical interface. We’ll examine the security and observability benefits it brings.

## Why Use a Service Mesh

In traditional development, we often work with large monolithic applications where a single program runs on the same platform—like Java web applications packaged in a `.war` file.

In microservices-based applications, this large application is divided into different microservices, each responsible for a specific function and running in its own process. This approach offers several benefits:

* **Scalability**
* **Integration of diverse services**
* **Development parallelization**

However, new challenges also arise with this architecture:

* It becomes challenging to track dependencies and understand which services communicate with each other.
* Overall control of the application can be lost.

For applications with more than 50 microservices, these issues become especially significant.

This is where a Service Mesh comes into play. A service mesh is an infrastructure layer that we can add to our microservices applications, allowing us to control service-to-service communication. Additionally, it provides other infrastructure-related benefits (such as communication encryption) so that developers can focus solely on the application's functionality.

Some of the benefits include:

* **Observability**: It provides data on communications through metrics, distributed traces, and access logs.
* **Traffic Management**: Through routing rules, we can control traffic flow across various layers.
* **Security**: It encrypts communications with TLS and allows us to introduce policies and access auditing.

![Service Mesh](images/service-mesh.png)

## What is Istio

Istio is an open-source Service Mesh that transparently overlays distributed applications. It can be seamlessly added to our microservices architecture to provide all the benefits of a Service Mesh.

In the following image, we can see Istio's architecture:

![istio](images/istio-architecture.png)

* Data plane
* Control plane

Istio operates with sidecars — a proxy deployed in each container of our workloads included in the Mesh. It uses an Envoy proxy, functioning at layer 7 in the data plane, to apply all the policies we configure.

There is another mode of operation in Istio called Ambient, currently in beta, which will be discussed later.

## What is Kiali

Kiali is a graphical interface for Istio that interprets the data produced by Istio and displays it through traffic charts, Mesh graphs, and diagrams. It enables us to easily visualize all available data for our applications, including traces and logs, and helps identify issues within the Mesh.

Additionally, Kiali allows us to create various Istio configurations using simple wizards.

The following image shows Kiali's architecture, including the necessary and optional services:

![kiali](images/kiali-architecture.png)


# Step-by-Step Installation

## Prerequisites

In this tutorial, we will use Minikube, an open-source tool that allows us to create and manage Kubernetes clusters in a local environment.

You will need administrator privileges for this setup.

What we need to download:

- Download the Kubernetes command-line tool [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).
- Download the latest version of [Minikube](https://kubernetes.io/docs/tasks/tools/#minikube).
- Download a [hypervisor](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download#install-a-hypervisor) for Minikube. VirtualBox can be used, but container management tools like Docker or Podman are also compatible.

If you do not want to use Minikube's default driver, you can set it up like this:

```bash
minikube config set driver kvm2
```

Start Minikube with the following command:

```bash
minikube start
```

If the default resources are insufficient, you can start it with this command:

```bash
minikube start --memory=16384 --cpus=4
```

## Installing Istio

In this section, we will cover how to install Istio in Sidecar mode. There are multiple ways to install Istio; here, we’ll use the `istioctl` command-line tool.

- Download [Istio](https://istio.io/latest/docs/setup/additional-setup/download-istio-release/):

```bash
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.23.2 TARGET_ARCH=x86_64 sh -
```

- Navigate to the downloaded folder:

```bash
cd istio-1.23.2
export ISTIO_HOME=$(pwd)
```

- Add the Istio client to the system path (Linux):

```bash
export PATH=$PWD/bin:$PATH
```

- Create the namespace for Istio:

```bash
kubectl create ns istio-system
```

- To install Istio, we’ll use "istioctl install". Configuration values can be passed using --set. For this tutorial, we will use the following configuration:

```bash
istioctl install --set values.meshConfig.enableTracing=true --set values.meshConfig.defaultConfig.tracing.zipkin.address=zipkin.istio-system:9411 --set values.meshConfig.defaultConfig.tracing.sampling=100.0
```

and we verify that everything is running correctly:

 ```bash
istio-1.23.2$ kubectl get pods -n istio-system
NAME                                    READY   STATUS    RESTARTS   AGE
istio-ingressgateway-64f9774bdc-wp54t   1/1     Running   0          1m
istiod-868cc8b7d7-n2gg4                 1/1     Running   0          2m
```

An alternative configuration method is as follows:

```
cat <<EOF > ./my-config.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
spec:
  meshConfig:
    accessLogFile: /dev/stdout
EOF
```

```bash
istioctl install -f my-config.yaml
```

You can list all profiles with the following command:

```bash
istioctl profile list
```

We’ll also install the Gateway API CRDs, which are not installed by default:

```bash
get crd gateways.gateway.networking.k8s.io &> /dev/null || { kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v1.1.0" | kubectl apply -f -; }
```

## Installing Addons

Kiali requires Prometheus to function properly, so we will install it as follows:

```bash
kubectl apply -f ${ISTIO_HOME}/samples/addons/prometheus.yaml
```

Grafana and Jaeger are optional, but we’ll also install them to access all available functionality within Kiali:

```bash
kubectl apply -f ${ISTIO_HOME}/samples/addons/grafana.yaml
```

```bash
kubectl apply -f ${ISTIO_HOME}/samples/addons/jaeger.yaml
```

Wait until everything has been created successfully:

```bash
/istio-1.23.2$ kubectl get pods -n istio-system
NAME                                    READY   STATUS              RESTARTS   AGE
grafana-7f76bc9cdb-tjnrc                0/1     ContainerCreating   0          14s
istio-ingressgateway-64f9774bdc-wp54t   1/1     Running             0          101m
istiod-868cc8b7d7-n2gg4                 1/1     Running             0          102m
jaeger-66f9675c7b-dshzt                 0/1     ContainerCreating   0          11s
prometheus-7979bfd58c-ml648             2/2     Running             0          102
```

## Installing Kiali

The easiest way to install Kiali is by applying the configuration YAML provided as an Istio addon.

We’ll make a few adjustments to Kiali’s configuration. Start by opening the YAML file and changing the following settings (make a backup first):

```bash
cp $ISTIO_HOME/samples/addons/kiali.yaml $ISTIO_HOME/samples/addons/kiali.copy.yaml
vim $ISTIO_HOME/samples/addons/kiali.yaml
```

Update the YAML file as follows:

```yaml
    external_services:
      custom_dashboards:
        enabled: true
      istio:
        root_namespace: istio-system
      tracing:
        enabled: true
        url: "http://localhost:16686/jaeger"
      grafana:
        enabled: true
        url: "http://localhost:3000"
```

Then, apply the YAML:

```bash
kubectl apply -f ${ISTIO_HOME}/samples/addons/kiali.yaml
```

This method isn’t recommended for production environments but works well for testing or as a quick setup for experimentation.

## Verifying the Installation
Let’s confirm that everything is installed correctly by listing the deployments, pods, and services in the Istio namespace (istio-system):

```bash
kubectl get all -n istio-system
```

This allows us to verify that all pods are running:

![kiali](images/istio-pods.png)

Now, let’s port-forward the Kiali service to access it:

```bash
istioctl dashboard kiali
```

Open your browser and go to:

[http://localhost:20001/](http://localhost:20001/)


![kiali](images/kiali.png)

## Installing a Demo Application: Bookinfo

The Bookinfo demo is an application composed of four microservices that demonstrates various Istio functionalities. It displays information about a book, similar to an entry in an online bookstore catalog. The page includes the book description, details (like ISBN, page count), and user reviews.

The application consists of the following microservices:

* **productpage**: Calls the `details` and `reviews` services to display information on its page.
* **details**: Contains information about the book.
* **reviews**: Contains reviews for the book and calls the `ratings` service.
* **ratings**: Provides book ratings, which accompany each review.

There are three versions of the `reviews` service:

* **v1**: Does not call `ratings`.
* **v2**: Calls `ratings` and displays ratings as black stars from 1 to 5.
* **v3**: Calls `ratings` and displays ratings as red stars from 1 to 5.

To deploy the Bookinfo application, start by creating a namespace:

```bash
kubectl create ns bookinfo
```

Once created, deploy the application in this namespace:

```bash
kubectl apply -f $ISTIO_HOME/samples/bookinfo/platform/kube/bookinfo.yaml -n bookinfo
```

Check that all containers are running:

```bash
istio-1.23.2$ kubectl get pods -n bookinfo --watch
NAME                             READY   STATUS    RESTARTS   AGE
details-v1-65cfcf56f9-t97c4      1/1     Running   0          66s
productpage-v1-d5789fdfb-5cc8r   1/1     Running   0          65s
ratings-v1-7c9bd4b87f-zrjr2      1/1     Running   0          65s
reviews-v1-6584ddcf65-pk4mm      1/1     Running   0          65s
reviews-v2-6f85cb9b7c-zzdtt      1/1     Running   0          65s
reviews-v3-6f5b775685-mkg7k      1/1     Running   0          65s
```

To test the application, send some traffic:

```bash
kubectl exec "$(kubectl get pod -l app=ratings -n bookinfo -o jsonpath='{.items[0].metadata.name}')" -c ratings -n bookinfo -- curl -sS productpage:9080/productpage | grep -o "<title>.*</title>"
```

The result should be:

`<title>Simple Bookstore App</title`

In Kiali, the new namespace appears with its workloads, but there are no traffic graphs. Kiali will show that the workloads are missing sidecars:

![kiali](images/missing-sidecars.png)

This happens because the application is not yet part of the service mesh. To add it, you can enable auto-injection in Kiali by clicking the "Enable Auto Injection" button on the namespace card:

![kiali](images/enable-ai.png)

This action is equivalent to adding the Istio injection label to the namespace:

```bash
kubectl label namespace bookinfo istio-injection=enabled
```

For changes to take effect, the pods must be restarted:

```bash
kubectl rollout restart deployment -n bookinfo
```

In Kiali, the "missing sidecars" message should no longer appear.

From the command line, if you list the Bookinfo pods, you’ll now see two containers per pod:

```bash
kubectl get pods -n bookinfo
```

![kiali](images/bookinfo-pods.png)

Send traffic again:

```bash
kubectl exec "$(kubectl get pod -l app=ratings -n bookinfo -o jsonpath='{.items[0].metadata.name}')" -c ratings -n bookinfo -- curl -sS productpage:9080/productpage | grep -o "<title>.*</title>"
```

After several requests, you’ll see a Traffic Graph similar to this:

![kiali](images/bookinfo-graph.png)

By adding our application to the service mesh, Istio generates metrics in Prometheus. Kiali interprets these metrics and displays them as this graph, allowing us to see the microservices that make up our application and the flow of communication between them.

You can select various data types to display.

The color of the arrow shows the protocol of the communication and its status. For example, a green arrow indicates an HTTP request with a 200 (OK) status code.

### Exposing the Application to External Traffic

Let's make the application accessible from outside the mesh. To do this, we will create an ingress gateway, which is responsible for mapping a path to a route from the entrance of the mesh.

```bash
kubectl apply -f $ISTIO_HOME/samples/bookinfo/gateway-api/bookinfo-gateway.yaml -n bookinfo
```

Next, we will change the default value of the gateway type, which is created as a LoadBalancer, to ClusterIP:

```bash
kubectl annotate gateway bookinfo-gateway networking.istio.io/service-type=ClusterIP --namespace=bookinfo
```

We can check the status of the gateway:

```bash
kubectl get gateway -n bookinfo
```

Now we can connect to the productpage service through this gateway:

```bash
kubectl port-forward svc/bookinfo-gateway-istio -n bookinfo 8080:80
```

Access the service from your browser at:

[http://localhost:8080/productpage](http://localhost:8080/productpage)

![kiali](images/productpage.png)

We'll keep a traffic generator running in another terminal:

```bash
while :; do curl -sS http://localhost:8080/productpage | grep -o "<title>.*</title>"; sleep 3; done > /dev/null

```

Now let's open Kiali to see how the graph looks:

![kiali](images/kiali-gateway-graph.png)

## Tracing

Let's open the Jaeger console:

```bash
istioctl dashboard jaeger
```

You will be able to see all the requests coming into our application:
![jaeger](images/jaeger_general.png)

And obtain information about each of them:
![jaeger](images/jaeger_trace.png)


# Applying Configurations

## Use Case with `end-user` Header

We will force a user to go to a specific version. Apply this file: [end-user-sample.yaml](https://raw.githubusercontent.com/kiali/community/refs/heads/main/events/2024_10_Setup_your_mesh_ES/config/end-user-sample.yaml )

```bash
kubectl apply -f https://raw.githubusercontent.com/kiali/community/refs/heads/main/events/2024_10_Setup_your_mesh_ES/config/end-user-sample.yaml -n bookinfo
```

What has happened?

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: biznagafest
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
```

Now the user `biznagafest` can only access version v2, while the rest go to version 1.

What does Kiali show if we remove the `DestinationRule`?

Now let's look at another example. We'll apply [end-user-abort.yaml](https://raw.githubusercontent.com/kiali/community/refs/heads/main/events/2024_10_Setup_your_mesh_ES/config/end-user-abort.yaml )

```bash

kubectl apply -f https://raw.githubusercontent.com/kiali/community/refs/heads/main/events/2024_10_Setup_your_mesh_ES/config/end-user-abort.yaml -n bookinfo
```

What has happened?

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    fault:
      abort:
        percentage:
          value: 100.0
        httpStatus: 500
    route:
    - destination:
        host: ratings
        subset: v1
  - route:
    - destination:
        host: ratings
        subset: v1
```

Let's resolve this.

We will explore the Kiali wizards and how we would do it.

More examples: Load balancing from one version to another.

# Istio Ambient

## What is Istio Ambient?

Istio Ambient is a new "sidecarless" architecture of Istio, where the use of the sidecar is replaced by two new components that operate at different layers. Currently, it is in beta phase. These two components are called ztunnel (L4) and Waypoint proxy (L7), which offer the same functionality as a sidecar but are not deployed within the application pod.

The goal of Ambient is to reduce infrastructure overhead and improve performance. When we want the basic functionalities of a Service Mesh (such as TLS communications, Layer 4 network policies, or Layer 4 observability), ztunnel will handle the processing, enhancing performance. Typically, there is one component per cluster node, and pod traffic will be redirected through ztunnel.

If we also need any Layer 7 functionality, we will include a Waypoint proxy. Currently, a Waypoint proxy is an Envoy proxy, the same component used in a sidecar, but it is not deployed one per pod. The recommendation is to create one per namespace.

In the following image, we can see the architecture of Istio Ambient:

![istio-ambient](images/istio-ambient.png)

## Installing Istio Ambient

Istio Ambient is installed with a different profile. You can upgrade the profile using the following command:

```bash
istioctl upgrade --set profile=ambient
```

Note: If you want to install Ambient instead of upgrading, it can be done as follows:

```bash
istioctl install --set profile=ambient
```

It will ask for confirmation to install the new Istio components. You can check that they are in the Istio namespace:

```bash
kubectl get all -n istio-system
```

![ambient-pods](images/ambient-pods.png)

## Adding Bookinfo to Ambient Mesh

The annotations for including a namespace in an Ambient Mesh are different from those for sidecars. In this way, namespaces with sidecars and Ambient can coexist within an Ambient Mesh. 

Now let's remove the sidecar annotations for Bookinfo:

```bash
kubectl label ns bookinfo istio-injection-
```

This can also be done from Kiali:

![eliminar-auto-inyeccion](images/eliminar-auto-inyeccion.png)

And then we restart:

```bash
kubectl rollout restart deployment -n bookinfo
```

We see that now the pods only have one container:

![bookinfo-pods-no-proxy](images/bookinfo-pods-no-proxy.png)

And they appear outside of the Mesh:

![out-of-mesh](images/out-of-mesh.png)

Now let's add them to the Ambient Mesh. We do this through annotations:

```bash
kubectl label namespace bookinfo istio.io/dataplane-mode=ambient
```

Let's check that our namespace has a label indicating it is included in Ambient:

![ambient-ns](images/ambient-ns.png)

In the list of workloads, there is no longer any message indicating that they are outside the Mesh. If we look at the details of a workload, we can see the Ambient label, and the tooltip that appears when we hover shows more information:

![ambient-wk-detail](images/ambient-wk-detail.png)

Let's send traffic through the gateway to see how the traffic graph looks:

```bash
kubectl exec "$(kubectl get pod -l app=ratings -n bookinfo -o jsonpath='{.items[0].metadata.name}')" -c ratings -n bookinfo -- curl -sS productpage:9080/productpage | grep -o "<title>.*</title>"
```

Now let's go to Kiali and to "Traffic Graph." We can increase the time if we haven't made many requests. And this is what we see:

![ztunnel-graph](images/ztunnel-graph.png)

Unlike a graph with sidecars, we see that the arrows in this case are blue instead of green. This means that the connections shown are TCP traffic. Why is this? Although they are actually HTTP connections, the ztunnel only establishes Layer 4 analysis, which is why it cannot identify Layer 7 information. In future versions (Kiali 2.0), a traffic selector for Ambient will be included to know the reporter from which the telemetry data was emitted, thereby addressing this situation.

![kiali-traffic-selector](images/kiali-traffic-selector.png)

As we can see, by selecting "security" in the Display menu, the traffic is encrypted:

![kiali-traffic-selector](images/trafico-encriptado.png)


## Adding a Waypoint Proxy

Let's include additional Layer 7 processing with a Waypoint proxy. We will create one for the entire namespace:

```bash
istioctl waypoint apply -n bookinfo --enroll-namespace
```

We see that a new workload has been created in Kiali, identified as Waypoint proxy:

![waypoint-proxy](images/waypoint-proxy.png)

If we look at the details of one of our applications, we can see that the L7 label has been added when we open the Ambient tooltip:

![waypoint-proxy-detail-app](images/waypoint-proxy-detail-app.png)

Now, let's go to the graph and observe that HTTP connections are visible:

![waypoint-proxy-detail-app](images/waypoint-graph.png)

In this version, we still see double arrows. In Kiali version 2.0, improvements will be included for the Ambient graph, showing a more simplified version.

In the Display menu, we can also select the "waypoint proxy" option to visualize the waypoint nodes in the graph:

![waypoint-proxy-detail-app](images/waypoint-proxy-nodes.png)

In this version, this option is still experimental, and we see that some arrows are missing (all traffic goes through Waypoint). These improvements will be included in Kiali version 2.0. This is because the telemetry adaptation for Ambient has not yet been implemented in the current code, as Waypoint reports telemetry in a slightly different way than sidecars do.

# Uninstalling Istio

To uninstall Istio, we do the following:

```bash
istioctl uninstall -y --purge
kubectl delete namespace istio-system
```