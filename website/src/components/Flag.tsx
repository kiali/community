export const Flag= (props: {lang: string}) => {

    switch (props.lang) {
        case "ES":
            return <>🇪🇸</>
        default:
            return <>🇺🇸</>
    }
}