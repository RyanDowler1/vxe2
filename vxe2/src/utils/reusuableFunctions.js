//Add a class to elems while they load. True = loading / False = finished loading
export function setIsLoading(isLoading, extraElems) {
  let elemsToLoad = [
    '#textbody',
    '.editor-tools',
    '#toc-panel',
    ...(extraElems ? extraElems : ''),
  ]; //Flatten and Merge the passed array (arg 2) with this array
  elemsToLoad.forEach((v) => {
    try {
      let theElement = document.querySelector(v);
      isLoading
        ? theElement.classList.add('isLoading')
        : theElement.classList.remove('isLoading');
    } catch (error) {
      console.log(`Issue Adding/Removing Loading state to: ${v}`);
    }
  });
}
