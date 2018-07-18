import React from 'react'
import { string, object } from 'prop-types'

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

import l from './CategoryEdit.less'

class CategoryEdit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categoryInitial: {},
            categoryEdited: {}
        }
    }

    async handleSave(e){
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
            } else {
                //TODO
            }
        })
    }

    componentDidMount(){
        const { category } = this.props
        if(category.name) 
            this.onNameChange(category.name)
        if(category.singularName) 
            this.onSingularNameChange(category.singularName)
        if(category.nameUrl) 
            this.onNameUrlChange(category.nameUrl)
        if(category.shortName)
            this.onShortNameChange(category.shortName)
    }

    onNameChange(val){
        this.props.form.setFieldsValue({ name: val })
    }
    onSingularNameChange(val){
        this.props.form.setFieldsValue({ singularName: val })
    }
    onNameUrlChange(val){
        this.props.form.setFieldsValue({ nameUrl: val })
    }
    onShortNameChange(val){
        this.props.form.setFieldsValue({ shortName: val })
    }

    render(){
        const { category } = this.props
        const { getFieldDecorator }  = this.props.form
        if(category){
            return (
                <Row className={ l.root }>
                    <Form onSubmit = { e => this.handleSave(e) }>
                        <Col sm={24} md={4}>
                            <img src={ `/assets/imgs/categories/${ category.image }` }/>
                            <FormItem>
                                <Button 
                                    type='primary'
                                    htmlType='submit'
                                >Сохранить</Button>
                                <Button>Отменить</Button>
                            </FormItem>
                        </Col>
                        <Col sm={24} md={10}>
                            { category.name && 
                                <FormItem label='Название' className={ l.formItem }>
                                    {getFieldDecorator('name', { rules: [
                                        { required: true, message: 'Обязательное поле' }
                                    ] })(
                                        <Input
                                            onChange={ val => this.onNameChange(val) } 
                                        />
                                    )}
                                </FormItem> 
                            }
                            { category.singularName && 
                                <FormItem label='Название в одиночном числе'  className={ l.formItem }>
                                    {getFieldDecorator('singularName', { rules: [
                                        { required: true, message: 'Обязательное поле' }
                                    ] })(
                                        <Input
                                            onChange={ val => this.onSingularNameChange(val) } 
                                        />
                                    )}
                                </FormItem> 
                            }
                            { category.nameUrl && 
                                <FormItem label='URL'  className={ l.formItem }>
                                    {getFieldDecorator('nameUrl', { rules: [
                                        { required: true, message: 'Обязательное поле' }
                                    ] })(
                                        <Input
                                            onChange={ val => this.onNameUrlChange(val) } 
                                        />
                                    )}
                                </FormItem> 
                            }
                            { category.shortName && 
                                <FormItem label='Вид техники'  className={ l.formItem }>
                                    {getFieldDecorator('shortName', { rules: [
                                        { required: true, message: 'Обязательное поле' }
                                    ] })(
                                        <Input
                                            onChange={ val => this.onShortNameChange(val) } 
                                        />
                                    )}
                                </FormItem> 
                            }
                        </Col>
                        <Col sm={24} md={10}>
                            <p>Виды неполадок:</p>
                        </Col>
                    </Form>
                </Row>
            )
        } else return ( <Spin/> )        
    }
}

CategoryEdit.propTypes = {
    category: object.isRequired
}

const CategoryEditForm = Form.create()(CategoryEdit)
export default CategoryEditForm

