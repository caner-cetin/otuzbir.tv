import ace from "ace-builds";

import { config } from "ace-builds";

config.set(
	"basePath",
	"https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/",
);
config.setModuleUrl(
	"ace/mode/javascript_worker",
	"https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js",
);

export const configureAce = () => {
	ace.config.set("basePath", "/node_modules/ace-builds/src-min-noconflict");
};
