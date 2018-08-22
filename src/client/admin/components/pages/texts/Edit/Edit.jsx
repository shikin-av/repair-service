import React from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router-dom'

import {
    getText as getTextApi,
    createText as createTextApi,
    editText as editTextApi
} from 'client/admin/api/texts'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import TextEditor from 'client/admin/components/content/TextEditor/TextEditor.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const FormItem = Form.Item
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            textInitial:      null,
            text:             null,
            isCreated:        false,
            loadStatus:       'load',
            breadcrumbsLinks: [{ url: '/texts', text:'Контент' }],
            title: null
        }
    }

    emptyText(){
        this.setState({
            loadStatus: 'empty',
            breadcrumbsLinks: [
                { url: '/texts', text:'Контент' },
            ]
        })
    }

    getText(nameUrl){
        try {
            return getTextApi(nameUrl)
            .then(text => {
                if(!text.error){
                    this.setState({
                        textInitial:      text,
                        text:             text,
                        loadStatus:       'complete',
                        breadcrumbsLinks: [
                            { url: '/texts', text:'Контент' },  
                            { url: text.nameUrl, text: text.title }
                        ],
                        title: text.title
                    }, () => {
                        this.setAllInputs(this.state.text)
                    })    
                } else {
                    this.emptyText()
                }                
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
            this.emptyText()
        }
    }

    componentWillMount(){
        if(this.props.type == 'create'){
            const empty = {
                title: '',
                nameUrl: '',
                content: '',
            }
            this.setState({
                textInitial: empty,
                text: empty,
                loadStatus: 'complete',
                breadcrumbsLinks: [
                    { url: '/texts', text:'Контент' },
                    { url: 'create', text: 'Новый текст' }
                ]
            })
        } else {
            const { nameUrl } = this.props.match.params
            this.getText(nameUrl)
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match && this.props.match.params){
            const oldNameUrl = this.props.match.params.nameUrl
            const newNameUrl = nextProps.match.params.nameUrl
            if(newNameUrl != oldNameUrl){
                this.getText(newNameUrl)
            }
        }  
    }

    async handleSave(e){
        const isCreateType = this.props.type == 'create'
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('VALUES: ', values)
                if(isCreateType){
                	try {
                		return createTextApi(values)
                		.then(text => {
                			this.setState({ isCreated: true }, () => {
                                message.success(`Текст ${ text.title } создан.`)
                            })	
            			})
                	} catch(err) {
                        message.error(`Текст ${ text.title } не создан.`)
                        console.log(`ERROR ${ err.stack }`)
                    }
                } else {
                	const { nameUrl } = this.props.match.params
                	try {
                        return editTextApi(nameUrl, values)
                        .then(text => {
                            message.success(`Текст ${ text.title } отредактирован.`)
                        })
                    } catch(err) {
                        message.error(`Текст ${ text.title } не отредактирован.`)
                        console.log(`ERROR ${ err.stack }`)
                    }
                }
            }  else {
                console.log(`ERROR ${err.stack}`)
            }	
        })
    }

    cancelChanges(){
    	this.setState({ text: this.state.textInitial }, () => {
    		this.setAllInputs(this.state.text)		
		})
        
    }

    setAllInputs(text){
        if(text.title){
            this.onTitleChange(text.title)
        }
        if(text.nameUrl){
            this.onNameUrlChange(text.nameUrl)
        }
        if(text.content){
            this.onContentChange(text.content)
        }
    }

    onTitleChange(val){
        this.props.form.setFieldsValue({ title: val })
    }
    onNameUrlChange(val){
        this.props.form.setFieldsValue({ nameUrl: val })
    }
    onContentChange(obj){
    	const { text } = this.state
    	this.setState({
    		text: {
    			title:   text.title,
    			nameUrl: text.nameUrl,
    			content: obj
    		}	
		})
        this.props.form.setFieldsValue({ content: obj })
    }

    render(){
    	const {
            text,
            isCreated,
            loadStatus,
            breadcrumbsLinks,
            title,
        } = this.state
        const { getFieldDecorator, getFieldValue }  = this.props.form
        const isCreateType = this.props.type == 'create'        

        return (
        	<Row className={ l.root }>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ true }
                    links={ breadcrumbsLinks }
                />
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Данного текста не существует'
                >
                <h1>{ title }</h1>
                { 
                    text &&
                    <Form onSubmit = { e => this.handleSave(e) }>
                    	<FormItem>
                            { !isCreated &&
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                >Сохранить</Button>
                            }
                            { !isCreateType &&
                                <Button
                                    onClick={ e => this.cancelChanges() }
                                >Отменить изменения</Button>
                            }
                        </FormItem>

                        <FormItem label='Заголовок' className={ l.formItem }>
                            {getFieldDecorator('title', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(
                                <Input
                                    onChange={ val => this.onTitleChange(val) }
                                />
                            )}
                        </FormItem>

                        <FormItem label='URL'  className={ l.formItem }>
                            {getFieldDecorator('nameUrl', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(
                                <Input
                                    onChange={ val => this.onNameUrlChange(val) }
                                />
                            )}
                        </FormItem>

                        <FormItem label='Текст'  className={ l.formItem }>
                            {getFieldDecorator('content', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(                                
                                <TextEditor
    								onDataToForm={ obj => this.onContentChange(obj) }
    								defaultValue={ text.content }
                                />
                            )}
                        </FormItem>
                    </Form>
                }
                </LoadedContentView>
            </Row>
    	)        
    }
}

Edit.propTypes = {
    type: string
}

const EditForm = Form.create()(Edit)
export default EditForm