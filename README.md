# Community

This repo contains the Kiali community side !

To explore more about Kiali community visit the website [https://kiali.org/community/](https://kiali.org/community/)



# Add a new talk/workshop

Create a folder withe the next pattern under [./events](./events) folder:


```
<FULL_YEAR>_<MONTH>_<NAME_TALK_JOIN_WITH_UNDERSCORE>

Example: 2024_10_Setup_your_mesh_ES
```

Inside of this folder we must create a `event.json` file. This file is loaded by the website to do the `magic`


```json
{
	"date": "YYYY-MM-DD",
	"place": "<City>, <Country>",
	"eventName": "<EventName>",
	"talkName": "<TalkName>",
	"description": "<Description>",
	"lang": "<LANG: ES | EN>",
	"type": "<Type talk | workshop>",
	"presentation": {
		"type" : "<type talk markdown | youtube>",
		"link": "<Link to presentation raw markdown file or embed video>"
	},	
	"folder_path": "<Github link to the folder>"
}

```

Json Example: [event.json](./events/2024_06_Kiali_Beyond_the_Graph_Troubleshooting_Istio/event.json)


All the images must be stored in `./events/<event_folder>/images/`
