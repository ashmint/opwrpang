export type DynamicTraefikConfig = {
    http?: Http;
};

export type Http = {
    routers?: Routers;
    services?: Services;
    middlewares?: Middlewares;
};

export type Routers = {
    [key: string]: Router;
};

export type Router = {
    entryPoints: string[];
    middlewares: string[];
    service: string;
    rule: string;
};

export type Services = {
    [key: string]: Service;
};

export type Service = {
    loadBalancer: LoadBalancer;
};

export type LoadBalancer = {
    servers: Server[];
};

export type Server = {
    url: string;
};

export type Middlewares = {
    [key: string]: MiddlewarePlugin;
};

export type MiddlewarePlugin = {
    plugin: Plugin;
};

export type Plugin = {
    [key: string]: MiddlewarePluginConfig;
};

export type MiddlewarePluginConfig = {
    [key: string]: any;
};
