import { availableType } from './constant';
export interface DatabaseParent {
  type: "database_id"
  database_id: string
}
export interface PageParent {
  type: "page_id"
  page_id: string
}
export interface WorkspaceParent {
  type: "workspace"
  workspace: true
}
export interface BlockParent {
  type: "block_id"
  block_id: string
}

export type ParentObject = DatabaseParent | PageParent | WorkspaceParent | BlockParent;

export interface EmojiObject {
  type: "emoji"
  emoji: string
}

export interface FileFileObject {
  type: "file"
  file: {
    url: string
    expiry_time: string
  }
}

export type NotionColor =
 "blue"
 | "blue_background"
 | "brown"
 | "brown_background"
 | "default"
 | "gray"
 | "gray_background"
 | "green"
 | "green_background"
 | "orange"
 |"orange_background"
 | "pink"
 | "pink_background"
 | "purple"
 | "purple_background"
 | "red"
 | "red_background"
 | "yellow"
 | "yellow_background"
export interface FileExternalObject {
  type: "external"
  external: {
    url: string
  }
}

export type FileObject  = FileFileObject | FileExternalObject;


export interface RichTextAnnotation {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: NotionColor
}

export interface BaseRichTextObject {
  annotations: RichTextAnnotation
  plain_text: string
  href?: string
}

export interface RichTextTextObject extends BaseRichTextObject {
  type: "text"
  text: {
    content: string
    link?: {
      url: string
    }
  }
}

export interface RichTextEquationObject extends BaseRichTextObject {
  type: "equation"
  equation: {
    expression: string
  }
}

export interface DatabaseMention {
  type: "database"
  database: {
    id: string
  }
}
export interface PageMention {
  type: "page"
  page: {
    id: string
  }
}
export interface DateMention {
  type: "date"
  date: {
    start: string
    end?: string
  }
}
export interface UserMention {
  type: "user"
  user: { // possibly a user object
    object: "user"
    id: string
  }
}
export interface LinkPreviewMention {
  type: "link_preview"
  link_preview: {
    url: string
  }
}
export interface TemplateMention {
  type: "template_mention"
  template_mention: {
    type: "template_mention_date"
    template_mention_date: "today" | "now"
  } | {
    type: "template_mention_user"
    template_mention_user: "me"
  }
}

export interface RichTextMentionObject extends BaseRichTextObject {
  type: "mention"
  mention: DatabaseMention | PageMention | DateMention | UserMention | LinkPreviewMention | TemplateMention
}

export type RichTextObject = RichTextTextObject | RichTextEquationObject | RichTextMentionObject;

export interface PropertyValue {
  id: string
  type: "rich_text" | "number" | "select" | "multi_select" | "status" | "date" | "formula" | "relation" | "rollup" | "title" | "people" | "files" | "checkbox" | "url" | "email" | "phone_number" | "created_time" | "created_by" | "last_edited_time" | "last_edited_by"
}

export interface BaseUser {
  object: "user"
  id: string
  type?: "person" | "bot"
  name?: string
  avatar_url?: string
  person: {
    email: string
  }
}
export interface UserPerson {
  type?: "person"
  person: {
    email: string
  }
}
export interface UserBot {
  type?: "bot"
  bot: object
  owner: {
    type: "user" | "workspace"
  }
  workspace_name: string
}
export type User = BaseUser & (UserPerson | UserBot)

export type PartialUser = Pick<User, "id" | "object">

export interface Page {
  object: "page"
  id: string
  created_time: string
  created_by: PartialUser
  last_edited_time: string
  last_edited_by: PartialUser
  archived: boolean
  icon: EmojiObject | FileExternalObject
  cover: EmojiObject | FileExternalObject
  properties: {
    [key: string]: PropertyValue
  }
  url: string
  parent: ParentObject
}

export type BlockType = typeof availableType[number];
// export type BlockType =
//  "bookmark"
// | "breadcrumb"
// | "bulleted_list_item"
// | "callout"
// | "child_database"
// | "child_page"
// | "column"
// | "column_list"
// | "divider"
// | "embed"
// | "equation"
// | "file"
// | "heading_1"
// | "heading_2"
// | "heading_3"
// | "image"
// | "link_preview"
// | "link_to_page"
// | "numbered_list_item"
// | "paragraph"
// | "pdf"
// | "quote"
// | "synced_block"
// | "table"
// | "table_of_contents"
// | "table_row"
// | "template"
// | "to_do"
// | "toggle"
// | "unsupported"
// | "video"
// | "code"

export interface BaseBlock {
  object: "block"
  id: string
  parent: ParentObject
  created_time: string
  created_by: PartialUser
  last_edited_time: string
  last_edited_by: PartialUser
  has_children: boolean
  archived: boolean
  type: BlockType
}

export interface HasChildren {
  children: BaseBlock[]
}

export interface BookmarkBlock extends BaseBlock {
  type: "bookmark"
  bookmark: {
    url: string
    caption: RichTextObject[]
  }
}

export interface BreadcrumbBlock extends BaseBlock {
  type: "breadcrumb"
  breadcrumb: {}
}

export interface BulletedListItemBlock extends BaseBlock {
  type: "bulleted_list_item"
  bulleted_list_item: {
    text: RichTextObject[]
    color: NotionColor
  } & HasChildren
}

export interface CalloutBlock extends BaseBlock {
  type: "callout"
  callout: {
    icon: EmojiObject | FileObject
    text: RichTextObject[]
    color: NotionColor
  }
}

export interface ChildDatabaseBlock extends BaseBlock {
  type: "child_database"
  child_database: {
    title: string
  }
}

export interface ChildPageBlock extends BaseBlock {
  type: "child_page"
  child_page: {
    title: string
  }
}

export interface CodeBlock extends BaseBlock {
  type: "code"
  code: {
    text: RichTextObject[]
    caption: RichTextObject[]
    language: string
  }
}

export interface ColumnBlock extends BaseBlock {
  type: "column"
  column: { }
}

export interface ColumnListBlock extends BaseBlock {
  type: "column_list"
  column_list: { }
}

export interface DividerBlock extends BaseBlock {
  type: "divider"
  divider: { }
}

export interface EmbedBlock extends BaseBlock {
  type: "embed"
  embed: {
    url: string
  }
}

export interface EquationBlock extends BaseBlock {
  type: "equation"
  equation: {
    expression: string
  }
}

export interface FileBlock extends BaseBlock {
  type: "file"
  file: {
    file: FileObject
    caption: RichTextObject[]
    type: FileObject["type"]
  }
}

export interface Heading1Block extends BaseBlock {
  type: "heading_1"
  heading_1: {
    text: RichTextObject[]
    color: NotionColor
    is_toggleable: true
  }
}
export interface Heading2Block extends BaseBlock {
  type: "heading_2"
  heading_2: {
    text: RichTextObject[]
    color: NotionColor
    is_toggleable: true
  }
}
export interface Heading3Block extends BaseBlock {
  type: "heading_3"
  heading_3: {
    text: RichTextObject[]
    color: NotionColor
    is_toggleable: true
  }
}

export interface ImageBlock extends BaseBlock {
  type: "image"
  image: FileObject
}

export interface LinkToPageBlock extends BaseBlock {
  type: "link_to_page"
  link_to_page: PageParent | DatabaseParent
}


export interface LinkPreviewBlock extends BaseBlock {
  type: "link_preview"
  link_preview: {
    url: string
  }
}

// MentionBlock?

export interface NumberedListItemBlock extends BaseBlock {
  type: "numbered_list_item"
  numbered_list_item: {
    text: RichTextObject[]
    color: NotionColor
  } & HasChildren
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph"
  paragraph: {
    text: RichTextObject[]
    color: NotionColor
  } & HasChildren
}

export interface PdfBlock extends BaseBlock {
  type: "pdf"
  pdf: {
    caption: RichTextObject[]
  } & FileObject
}

export interface QuoteBlock extends BaseBlock {
  type: "quote"
  quote: {
    text: RichTextObject[]
    color: NotionColor
  } & HasChildren
}

export interface SyncedBlockBlock extends BaseBlock {
  type: "synced_block"
  synced_block: {
    synced_from: null
  } & HasChildren
}

export interface DuplicateSyncedBlockBlock extends BaseBlock {
  type: "synced_block"
  // the documentation for this is wonky: https://developers.notion.com/reference/block#duplicate-synced-block
  synced_block: {
    synced_from: {
      type: "block_id"
      block_id: string
    }
  }
}

export interface TableBlock extends BaseBlock {
  type: "table"
  table: {
    table_width: number
    has_column_header: boolean
    has_row_header: boolean
  }
}

export interface TableRowBlock extends BaseBlock {
  type: "table_row"
  table_row: {
    cells: RichTextObject[]
  }
}

export interface TableOfContentsBlock extends BaseBlock {
  type: "table_of_contents"
  table_of_contents: {
    color: NotionColor
  }
}

export interface ToDoBlock extends BaseBlock {
  type: "to_do"
  to_do: {
    text: RichTextObject[]
    color: NotionColor
    checked: boolean
  } & HasChildren
}

export interface ToggleBlock extends BaseBlock {
  type: "toggle"
  toggle: {
    text: RichTextObject[]
    color: NotionColor
  } & HasChildren
}

export interface VideoBlock extends BaseBlock {
  type: "video"
  video: FileObject
}

export type Block = BookmarkBlock | BulletedListItemBlock | CalloutBlock | ChildDatabaseBlock | ChildPageBlock | CodeBlock | ColumnBlock | ColumnListBlock | DividerBlock | EmbedBlock | EquationBlock | FileBlock | Heading1Block | Heading2Block | Heading3Block | ImageBlock | LinkToPageBlock | LinkPreviewBlock | NumberedListItemBlock | ParagraphBlock | PdfBlock | QuoteBlock | SyncedBlockBlock | TableBlock | TableRowBlock | TableOfContentsBlock | ToDoBlock | ToggleBlock | VideoBlock

export interface BlockMap {
  [key: string]: Block
}

export interface PageMap {
  [key: string]: Page
}



//
//
//


export interface BlockValue {
  id: string
  version: number
  type: string
  properties: Properties
  content: string[]
  format: Format
  permissions: Permission[]
  created_time: number
  last_edited_time: number
  parent_id: string
  parent_table: string
  alive: boolean
  created_by_table: string
  created_by_id: string
  last_edited_by_table: string
  last_edited_by_id: string
  space_id: string
}

export interface Format {
  domain?: string
  original_url?: string
  page_icon?: string
  drive_properties: GoogleDriveProperties
  [key: string]: any
}

export interface GoogleDriveProperties {
  file_id: string
  icon: string
  modified_time: number
  thumbnail: string
  title: string
  trashed: boolean
  url: string
  user_name: string
  version: string
}

export interface Permission {
  role: Role
  type: string
  added_timestamp: number
}

export interface Properties {
  title: string[]
  caption?: string[]
  description?: string[]
  language?: string[]
  [key: string]: any
}

export enum Role {
  Reader = "reader",
}

export interface PageLinkOptions {
  component: any
  href: string
}

export type NotionBlockProps = {
  blockMap: BlockMap
  contentId?: string
  contentIndex: number
  embedAllow: string
  fullPage: boolean
  hideList?: string[]
  level: number
  mapImageUrl: Function
  mapPageUrl: Function
  pageLinkOptions?: PageLinkOptions
  pageLinkTarget: string
  prism: boolean
  katex: boolean
  textLinkTarget: string
}
