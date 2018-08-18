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
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            textInitial: null,
            text: null,
            isCreated: false,
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
                text: empty
            })
        } else {
            const { nameUrl } = this.props.match.params
            try {
                return getTextApi(nameUrl)
                .then(text => {
                    this.setState({
                        textInitial: text,
                        text: text
                    }, () => {
                        this.setAllInputs(this.state.text)
                    })
                })
            } catch(err) {
                console.log(`ERROR ${err.stack}`)
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
            isCreated
        } = this.state
        const { getFieldDecorator, getFieldValue }  = this.props.form
        const isCreateType = this.props.type == 'create'
        if(text){
            const breadcrumbsLinks = [{ url: '/texts', text:'Контент' }]
            if(this.props.type == 'create'){
                breadcrumbsLinks.push({ url: 'create', text: 'Новый текст' })
            } else {
                breadcrumbsLinks.push({ url: text.nameUrl, text: text.title })
            }

	        return (
	        	<Row className={ l.root }>
                    <BreadcrumbsPanel
                        history={ this.props.history }
                        backButton={ true }
                        links={ breadcrumbsLinks }
                    />
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
                </Row>
	    	)
        }  else return ( <Spin/> )
    }
}

Edit.propTypes = {
    type: string
}

const EditForm = Form.create()(Edit)
export default EditForm