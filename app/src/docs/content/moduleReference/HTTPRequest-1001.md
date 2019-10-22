
[comment]: # (IntegrationsCanvasModule)

HTTP Request module sends inputs as HTTP request to given URL, and returns server response. Headers, query params and body should be Maps. Body can also be List or String. Request body format can be changed in Options. Default is JSON. Server is expected to return JSON formatted documents.

HTTP Request is asynchronous by default. Synchronized requests block the execution of the whole canvas until they receive the server response, but otherwise they work just like any other module; asynchronous requests on the other hand work like streams in that they activate modules they're connected to only when they receive data from the server.

If a data path branches, and one branch passes through the HTTP Request module and another around it, if they also converge in a module, that latter module may experience multiple activations due to asynchronicity. This also means that server responses may arrive in different order than they were sent.

If this kind of behaviour causes problems, you can try to fix it by changing sync mode to synchronized in Options. However, data throughput WILL be lower, and external servers may freeze your canvas simply by responding very slowly or not at all. For simple data paths and somewhat stable response times, the two sync modes will yield precisely the same results.
