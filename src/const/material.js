/**
 * public final static int FILE_TYPE_IMG = 1;
 public final static int FILE_TYPE_VIDEO = 2;
 public final static int FILE_TYPE_LINK = 3;
 public final static int FILE_TYPE_AUDIO = 4;
 public final static int FILE_TYPE_TXT = 5;
 * @type {{}}
 */
export const fileTypeMap = {
  img: 1,
  video: 2,
  link: 3,
  audio: 4,
  txt: 5,
  other: 0
}

export function getFileTypeByName (typeName) {
  switch (typeName) {
    case 'image':
    case 'img':
      return fileTypeMap.img
    case 'video':
      return fileTypeMap.video
    case 'link':
    case 'embed':
      return fileTypeMap.link
    case 'audio':
      return fileTypeMap.audio
    case 'text':
    case 'txt':
      return fileTypeMap.txt
    default:
      return fileTypeMap.other
  }
}

export function getTypeNameByType (type) {
  switch (type) {
    case fileTypeMap.txt:
      return 'text'
    case fileTypeMap.img:
      return 'image'
    case fileTypeMap.audio:
      return 'audio'
    case fileTypeMap.video:
      return 'video'
    case fileTypeMap.link:
      return 'embed'
  }
}
