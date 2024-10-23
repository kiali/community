import React from "react";
import Markdown from 'react-markdown'
import ReactGoogleSlides from "react-google-slides";

export const TalkView = (props: {type: string, link: string, path: string}) => {   
    const [content, setContent] = React.useState<string>("")

    React.useEffect(() => {
        if(props.type === 'markdown'){  
            const fetchMarkdown = async () => {
                // get the data from the api
                const data = await fetch(props.link);
                const mark = await data.text()                
                setContent(mark.replaceAll('images/', `https://raw.githubusercontent.com/kiali/community/main/${props.path}/images/`));
                }
            fetchMarkdown() 
            
            // make sure to catch any error
                .catch(console.error);   
        }       
    }, [props])
    
    
   
    return (
        <>

            {props.type === 'markdown' && (
                <Markdown>{content}</Markdown>
            )}
            {props.type === 'youtube' && (
                <div style={{marginTop: "10px"}}>
                <iframe width="100%" height="500" src={props.link} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
            )}
            {props.type === 'presentation' && (
                <ReactGoogleSlides
                width={"100%"}
                height={600}
                slidesLink={props.link}
                slideDuration={10}
                position={1}
                showControls
                allowFullScreen
              />
            )}
        </>
    )
}