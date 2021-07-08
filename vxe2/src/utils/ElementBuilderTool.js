/****

    Params: 
        +typeOfElem (example: 'div' or 'button'),
        +appendTo (example: 'theId'), //This param is no longer used - now use react elems
        +valuesArray (array of strings),
        +attributesObj (object with key and values, where key=attribute name and value = value)
        +customiseFirstChild (null by default and populated with an object similar to attributesObj)
        +nesetedChildElements (an object containing info about nested elements. info = type of tag it is and an object of attributes)
****/

export default function outputHTMLFromArray(
  typeOfElem,
  appendTo,
  valuesArray,
  attributesObj,
  customiseFirstChild,
  nesetedChildElements
) {
  let firstElemCustomised = false;
  let finalArrayButLegit = []; //Store objects in here (object = description of element)
  valuesArray.forEach((element, i) => {
    //console.log('iio looping over:', element, 'loopno:', i)
    let elemAsObj = {};
    elemAsObj.text = element;

    //** Set all atributes
    let attributeVal = "";
    let attributeValForNestedChildren = "";
    let attributeArrayForNestedChildren = [];
    let attrArray = []; //this is to add/read a attr entry each time

    //** Build and Customise the first element if customiseFirstChild passed
    // If = custom settings for the first child / else = rest of elems
    if (customiseFirstChild != null && firstElemCustomised == false && i < 1) {
      elemAsObj.type = customiseFirstChild.type; //set the type of html elem this will eventually bet

      //Add custom attributes to first item
      Object.keys(customiseFirstChild).forEach((elem, i) => {
        //Provide access the current value of this iteration by using the string 'value'
        customiseFirstChild[i] == "value"
          ? (attributeVal = element.replace(/[^A-Z0-9]/gi, "")) //remove spaces and symbols
          : (attributeVal = customiseFirstChild[elem]);

        //Add the attributes now that the var is properly populated
        attrArray.push({ [elem]: attributeVal });
        elemAsObj.attrsssss = attrArray;
        firstElemCustomised = true; //mark this task (first elem customized) as complete
        return elemAsObj;
      });
      //Add completed first elem to array
      finalArrayButLegit.push(elemAsObj);
    } else {
      //posibly dont need - its in global scope and we are finised with it above
      //let elemAsObj = {};
      elemAsObj.text = element;

      //Add the rest of the attributes
      for (var key in attributesObj) {
        //Provide access the current value by using the string 'value'
        attributesObj[key] == "value"
          ? (attributeVal = element.replace(/[^A-Z0-9]/gi, "")) //remove spaces and symbols
          : (attributeVal = attributesObj[key]);
        //Add atribute to attribute array
        attrArray.push({ [key]: attributeVal });
      }
      //add child nodes/elements to this element  /  as well as add the attributes
      let objectNestedChildElem = {};
      for (var key in nesetedChildElements.attributes) {
        //Provide access the current value by using the string 'value'
        nesetedChildElements.attributes[key] == "value"
          ? (attributeValForNestedChildren = element)
          : (attributeValForNestedChildren =
              nesetedChildElements.attributes[key]);

        attributeArrayForNestedChildren.push({
          [key]: attributeValForNestedChildren,
        });
      }
      objectNestedChildElem.attributess = attributeArrayForNestedChildren;
      objectNestedChildElem.elemType = nesetedChildElements.type;
      elemAsObj.attrss = attrArray;
      elemAsObj.childNode = objectNestedChildElem;
      finalArrayButLegit.push(elemAsObj);
    }
  });
  return finalArrayButLegit;
}
