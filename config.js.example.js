//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  //Settings that can be specified by the authors
  //background: "NONE", //background can be "NONE" or a URL.
  numberOfWires: 5, //Number of wires
  timer: "TRUE", //timer can be "TRUE" or "FALSE".

  //Settings that will be automatically specified by the Escapp server
  //solutionLength: 4, // //Number of wires that need to be cut. If solutionLength is not specified, it will automatically be set to numberOfWires.
  locale:"es",

  escappClientSettings: {
    endpoint:"https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
    preview: false
  },
};