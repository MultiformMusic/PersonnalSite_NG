
module.exports = {

    getImage: function(item) {

        let imgUrl = undefined;

        if (item.content && item.content.includes('img')) {
            imgUrl = processImageUrl('src', item.content);
        }

        if (item['content:encoded']) {
            let content = item['content:encoded'];  
            if (content && (content.includes('data-pin-media') || content.includes('img'))) {
                imgUrl = processImageUrl('src', content);
            }    
        }

        return imgUrl;
    }
}

function processImageUrl(attribute, content) {

    let imgUrl = undefined;

    let srcIndex = content.indexOf(attribute);
    if (srcIndex !== -1) {
       srcIndex += attribute.length + 2;
       let imgSrc = content.substring(srcIndex);
       const indexSpace = imgSrc.indexOf(" ");
       imgUrl = imgSrc.substring(0, indexSpace - 1);
    }


    return imgUrl;
}