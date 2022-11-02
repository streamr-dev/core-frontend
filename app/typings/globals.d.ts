declare module "*.pcss";
declare module "*.svg";
declare module "*.png";
declare module "*.json";

declare namespace React {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        css?: any;
    }
}
