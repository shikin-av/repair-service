import React from 'react'
import { Editor, getEventRange, getEventTransfer } from 'slate-react'
import { Value, Block } from 'slate'
import Plain from 'slate-plain-serializer'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Modal = require('antd/lib/modal')
require('antd/lib/modal/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import { renderNode, renderMark } from 'client/admin/components/content/TextEditor/renderElements'
import Gallery from 'client/admin/components/content/Gallery/Gallery.jsx'

import l from './TextEditor.less'

const DEFAULT_NODE = 'paragraph'
const IconEditor = ({ className, ...rest }) => {
    return <span className={`material-icons ${ className }`} { ...rest } />
}
const isImage = url => {
    return !!imageExtensions.find(url.endsWith)
}
const insertImage = (change, src, target) => {
    if(target){
        change.select(target)
    }
    change.insertBlock({
        type: 'image',
        isVoid: true,
        data: { src },
    })
}

class TextEditor extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: Plain.deserialize(''),
            showGallery: false,
            selectedImage: null,
            preSelectedImage: null,
        }              
    }

    componentWillMount(){
        const { defaultValue } = this.props
        if(defaultValue){
            this.setState({
                value: Value.fromJSON(defaultValue)   
            })    
        }        
    }

    componentWillReceiveProps(nextProps){
        const oldDefaultValue = this.props.defaultValue
        const newDefaultValue = nextProps.defaultValue
        if(newDefaultValue != oldDefaultValue){
            this.setState({
                value: Value.fromJSON(newDefaultValue)   
            })
        }
    }

    hasMark(type){
        const { value } = this.state
        return value.activeMarks.some(mark => mark.type == type)
    }

    hasBlock(type){
        const { value } = this.state
        return value.blocks.some(node => node.type == type)
    }

    renderMarkButton(type, icon){
        const isActive = this.hasMark(type)        
        return (
            <Button                
                onMouseDown={ e => this.onClickMark(e, type) }
                className={ isActive ? l.activeButton : l.button }
            >
                <IconEditor>{ icon }</IconEditor>
            </Button>
        )
    }

    renderBlockButton(type, icon){
        let isActive = this.hasBlock(type)
        if(['numbered-list', 'bulleted-list'].includes(type)) {
            const { value } = this.state
            const parent = value.document.getParent(value.blocks.first().key)
            isActive = this.hasBlock('list-item') && parent && parent.type == type
        }

        return (
            <Button
                onMouseDown={ event => this.onClickBlock(event, type) }
                className={ isActive ? l.activeButton : l.button }
            >
                <IconEditor>{ icon }</IconEditor>
            </Button>
        )
    }

    onClickMark(event, type){
        event.preventDefault()
        const { value } = this.state
        const change = value.change().toggleMark(type)
        this.onChange(change)
    }

    onClickBlock(event, type){
        event.preventDefault()
        const { value } = this.state
        const change = value.change()
        const { document } = value

        if(type != 'bulleted-list' && type != 'numbered-list'){
            const isActive = this.hasBlock(type)
            const isList = this.hasBlock('list-item')

            if(isList){
                change
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                change.setBlocks(isActive ? DEFAULT_NODE : type)
            }
        } else {
            const isList = this.hasBlock('list-item')
            const isType = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type == type)
            })

            if(isList && isType){
                change
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if(isList){
                change
                    .unwrapBlock(
                        type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                change.setBlocks('list-item').wrapBlock(type)
            }
        }
        this.onChange(change)
    }
    
    openGallery(){
        this.setState({ showGallery: true })
    }

    handleModalGalleryOk(){
        const { preSelectedImage } = this.state

        if(preSelectedImage){
            this.setState({
                selectedImage: preSelectedImage,
                showGallery: false
            }, () => {
                const src = `/assets/imgs/${ this.state.selectedImage }`
                const change = this.state.value.change().call(insertImage, src)
                this.onChange(change)
            })
        } else {
            message.warning('Выберите изображение')
        }
    }

    handleModalGalleryCancel(){
        this.setState({
            showGallery: false,
            selectedImage: null
        })
    }

    handleSelectImage(fileName){
        this.setState({ preSelectedImage: fileName })
    }

    onChange({ value }){
        this.setState({ value }, () => {
            this.props.onDataToForm(value)
        })
    }

    render() {        
        return (
            <div className={ l.root }>
                <Row className={ l.toolbar }>
                    { this.renderMarkButton('bold', 'format_bold') }
                    { this.renderMarkButton('italic', 'format_italic') }
                    { this.renderMarkButton('underlined', 'format_underlined') }
                    { this.renderBlockButton('heading-one', 'looks_one') }
                    { this.renderBlockButton('heading-two', 'looks_two') }
                    { this.renderBlockButton('block-quote', 'format_quote') }
                    { this.renderBlockButton('numbered-list', 'format_list_numbered') }
                    { this.renderBlockButton('bulleted-list', 'format_list_bulleted') }                    
                    <Button
                        onMouseDown={ () => this.openGallery() }
                        className={ l.button }
                    >
                        <IconEditor>image</IconEditor>
                    </Button>
                </Row>
                <Row>
                    <Editor 
                        value={ this.state.value } 
                        onChange={ obj => this.onChange(obj) }
                        className={ `ant-input ${ l.editor }` }
                        renderNode={ props => renderNode(props) }
                        renderMark={ props => renderMark(props) }
                        placeholder='Начните печатать...'
                    />
                </Row>
                <Modal
                    title='Выберите изображение'
                    visible={ this.state.showGallery }
                    onOk={ e => this.handleModalGalleryOk() }
                    onCancel={ e => this.handleModalGalleryCancel() }
                    width={ 700 }
                >
                    <Gallery
                        onClickToImage={ fileName => this.handleSelectImage(fileName) }
                        inModal={ true }
                    />
                </Modal>
            </div>
        )
    }
}

export default TextEditor