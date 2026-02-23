import type Quill from 'quill'

export abstract class QuillModule<ModuleOptions = any> {
  protected quill: Quill
  protected options?: ModuleOptions

  constructor(quill: Quill, options?: ModuleOptions) {
    this.quill = quill
    this.options = options
  }
}
