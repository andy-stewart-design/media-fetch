You are an expert Typescript developer. I am building an application in Typescript and need help. Given the following type structure/requirements, can you help me figure out the simplest and most flexible way to set up the Interfaces for this application?

We have two types of messages, `Plugin Messages` (i.e., from the back end plugin) and `Client Messages` (i.e., from the front end UI).

All message types will include the following properties:

- type: i.e., `IMAGE_QUERY_INIT` or `UI_ERROR_MESSAGE`, to identify the type of message being sent
- payload: an object conataining any data associated with the message.

The types of `Plugin Messages` include:

- Initial Results (`ImageResultsInitial`), which includes:
  - type: `RESULTS_INIT`
  - payload:
    - images: an Array or StockImageData
- Additional Results (`ImageResultsAdditional`), which includes:
  - type: `RESULTS_ADD`
  - payload:
    - images: an Array or StockImageData
- Error (`PluginErrorMessage`), which includes:
  - type: `ERROR`
  - payload:
    - message: a string, to be displayed in the UI

The types of `Client Messages` include:

- Initial Query (`ImageQueryInitial`)
  - type: `QUERY_INIT`
  - payload:
    - query: string, a term to be used to query the image databases
- Additional Queries (`ImageQueryAdditional`)
  - type: `QUERY_ADD`
  - payload:
    - query: string, a term to be used to query the image databases
- Error (`UIErrorMessage`)
  - type: `ERROR`
  - payload:
    - message: a string, to be displayed in a toast message
