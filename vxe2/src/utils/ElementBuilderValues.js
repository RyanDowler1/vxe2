/***************************************
 * Example objects for the different types of values the builder works with *
    
    1- typeOfElem: "h1",
    2- valuesArray: [
            "Euro",
            "Yen",
            "Dong"
            //add more values
        ],
    3- attributesObj: {
            className: "myClassName",
            "data-linkid": "value",
            //add more key pair values (attributes)
        },
    4- customiseFirstChild: {
            className: "tablinks first-elem",
            id: "yoo",
            type: "h6",
            //add more key pair values (attributes)
        },
    5- nesetedChildElements: {
            type: "span",
            attributes: {
                className: "someClassNameHere",
                id: "myLovelyId",
                //add more key pair values (attributes)
            },
        }
/***************************************/

export default function elemVals() {
    return {
        //<Value block 1>
        languageValues: {
            typeOfElem: "div",
            valuesArray: [
                "Currencies",
                "Czech",
                "Danish",
                "Dutch",
                "Finnish",
                "French",
                "German",
                "Greek",
                "Hungarian",
                "Icelandic",
                "IPA English",
                "IPA Full",
                "Italian",
                "Math / Sci.",
                "Norwegian",
                "Pinyin",
                "Portuguese",
                "Romanian",
                "Russian",
                "Spanish",
                "Swedish",
                "Symbols",
                "Turkish",
                "Vietnamese",
                "Welsh",
                "Chinese / Japanese / Korean",
            ],
            attributesObj: {
                className: "tablinks",
                "data-linkid": "value",
                more: "and its val yo",
            },
            customiseFirstChild: {
                className: "tablinks active 34",
                id: "defaultOpen",
                type: "h3",
            },
            nesetedChildElements: {
                type: "span",
                attributes: {
                    className: "somethign else",
                    id: "sym_cl667",
                    programmer: "kaio",
                },
            }
        }, // </Value block 1>
        //<Value block 2>
        moreValues: {
            typeOfElem: "h1",
            valuesArray: [
                "unoooo",
                "dos",
                "tres"
            ],
            attributesObj: {
                className: "somef",
                "data-linkid": "value",
                more: "something else",
            },
            customiseFirstChild: {
                className: "tablinks first-elem",
                id: "yoo",
                type: "h6",
            },
            nesetedChildElements: {
                type: "span",
                attributes: {
                    className: "somethign elseagain",
                    id: "sym_cl6678888",
                    programmer: "ma",
                },
            }
        }, // </Value block 2>
        //</Value block 2>
    }
}