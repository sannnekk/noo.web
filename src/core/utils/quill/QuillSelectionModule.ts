import Quill from 'quill'
import { QuillModule } from './QuillModule'

export interface QuillSelectionModuleOptions {}

/**
 * Quill Selection Module
 */
export class QuillSelectionModule extends QuillModule {
  private toolEnabled: boolean = false
  /**
   * Constructor
   */
  constructor(quill: Quill, options?: QuillSelectionModuleOptions) {
    super(quill, options)

    document.addEventListener(
      'selectionchange',
      this.handleSelectionChange.bind(this)
    )
  }

  /**
   * Tool action
   */
  public get enabled() {
    return this.toolEnabled
  }

  /**
   * Tool action
   */
  public set enabled(value: boolean) {
    this.toolEnabled = value
  }

  /**
   * Handle selection change
   */
  private handleSelectionChange() {
    if (!this.toolEnabled) return

    const selection = window.getSelection()

    if (!selection) return

    let range: Range | null = null

    try {
      range = selection.getRangeAt(0)
    } catch (error) {
      return
    }

    if (!range) return

    // get selection html
    const content = range.cloneContents()

    // DocumentFragment to HTML
    const div = document.createElement('quote')
    div.appendChild(content)
    const html = div.innerHTML

    // convert to delta
    const delta = this.quill.clipboard.convert({ html })

    // insert delta without removing the current quill content
    this.quill.updateContents(delta)
  }
}
