
module.exports = {

    getImage: function(item) {

        let imgUrl = undefined;

        if (item.content && item.content.includes('img')) {
            imgUrl = processImageUrl('src', item.content);
        }

        if (item['content:encoded']) {
            let content = item['content:encoded'];  
            //if (content instanceof String) {
                if (content && (content.includes('data-pin-media') || content.includes('img'))) {
                    imgUrl = processImageUrl('src', content);
                //}    
            } else if (content instanceof Object) {
                if (content._ && content._.includes('img')) {
                    imgUrl = processImageUrl('src', content._);
                    console.log(imgUrl);
                }
            }
        }

        if(item['media:content']) {
            let content = item['media:content'];
            if (content.$) {
                imgUrl = content.$.url;
            }
        }

        if(!imgUrl && item.link.includes('youtube')) {
            const link = item.link;
            if (!link.includes('embed')) {
                imgUrl = processYoutubeLink(link);
            } else {
            imgUrl = item.link;
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

function processYoutubeLink(link) {

    let videoUrl = undefined;

    const lastIndexSlash = link.lastIndexOf("/");
    const beginUrl = link.substring(0, lastIndexSlash);
    const indexOfId = link.indexOf("=");
    const idValue= link.substring(indexOfId + 1);

    videoUrl = beginUrl + "/embed/" + idValue;

    return videoUrl;
}