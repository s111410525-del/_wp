const contents = ["Very long content here", "Another Very long content here", "3rd Very long content here"];

const summaries = contents.map(str => {
  return str.substring(0, 10) + "...";
});

console.log(summaries); 
// ["Very long ...", "Another Ve...", "3rd Very l..."]