figma.showUI(__html__, {
  height: 500,
  width: 500,
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "image-search") {
    figma.notify(`You searched for ${msg.query}`);
  }
  figma.closePlugin();
};
