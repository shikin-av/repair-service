import React from 'react'
import { string } from 'prop-types'

import { 
    getCategory as getCategoryApi,
    createCategory as createCategoryApi,
    editCategory as editCategoryApi
} from 'client/admin/api/categories'

import config from 'client/../config/server'
import Gallery from 'client/admin/components/content/Gallery/Gallery.jsx'

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
const Modal = require('antd/lib/modal')
require('antd/lib/modal/style/css')

import l from './CategoryEditPage.less'

class CategoryEditPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categoryInitial: null,
            category: null,
            showGallery: false,
            selectedImage: null,
            preSelectedImage: null
        }
    }
    
    componentWillMount(){        
        if(this.props.type == 'create'){
            const empty = {
                name: '',
                singularName: '',
                nameUrl: '',
                shortName: ''
            }
            this.setState({ 
                categoryInitial: empty,
                category: empty 
            })
        } else {
            const { nameUrl } = this.props.match.params
            try {
                return getCategoryApi(nameUrl)
                .then(category => {
                    this.setState({ 
                        categoryInitial: category,
                        category: category 
                    }, () => {
                        this.setAllInputs(this.state.category)
                    })
                })
            } catch(err) {
                console.log(`ERROR ${err.stack}`)
            }
        }        
    }

    async handleSave(e){
        const isCreate = this.props.type == 'create'
        
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                /*if(values.image){
                    const image = values.image[0]['thumbUrl']
                    values.image = image
                }*/
                console.log('VALUES: ', values)
                if(isCreate){
                    try {
                        return createCategoryApi(values)
                        .then(category => {
                            message.success(`Категория ${category.shortName} создана.`)
                        })
                    } catch(err) {
                        message.error(`Категория ${category.shortName} не создана.`)
                        console.log(`ERROR ${err.stack}`)
                    }
                } else {
                    const { nameUrl } = this.props.match.params
                    try {
                        return editCategoryApi(nameUrl, values)
                        .then(category => {
                            message.success(`Категория ${category.shortName} отредактирована.`)
                        })
                    } catch(err) {
                        message.error(`Категория ${category.shortName} не отредактирована.`)
                        console.log(`ERROR ${err.stack}`)
                    }
                }

            } else {
                console.log(`ERROR ${err.stack}`)
            }
        })
    }

    cancelChanges(){
        this.setState({ selectedImage: null }, () => {
            this.setAllInputs(this.state.categoryInitial)
        })
    }

    setAllInputs(category){
        if(category.name){
            this.onNameChange(category.name)
        }            
        if(category.singularName){
            this.onSingularNameChange(category.singularName)
        }            
        if(category.nameUrl){
            this.onNameUrlChange(category.nameUrl)
        }
        if(category.shortName){
            this.onShortNameChange(category.shortName)
        }
        if(category.image){
            this.onImageChange(category.image)
        }
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
    onImageChange(val){
        this.props.form.setFieldsValue({ image: val })
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
                this.onImageChange(this.state.selectedImage)
            })
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

    render(){
        const { category, showGallery, selectedImage } = this.state
        const { getFieldDecorator, getFieldValue }  = this.props.form
        const isCreate = this.props.type == 'create'
        if(category){
            return (
                <Row className={ l.root }>
                    <Form onSubmit = { e => this.handleSave(e) }>
                        <Col sm={24} md={4}>
                            {   (selectedImage || getFieldValue('image')) &&
                                <img src={ `${ config.assetsPath }/imgs/${ selectedImage || getFieldValue('image') }` }/>
                            }

                            <FormItem
                                >
                                {getFieldDecorator('image', 
                                    { 
                                        rules: [
                                            { required: true, message: 'Обязательное поле' }
                                        ],
                                        //valuePropName: 'fileList',
                                        //getValueFromEvent: this.onUploadImage
                                    })(
                                    <Button
                                        onClick = { e => this.openGallery() }
                                    >
                                        <Icon type="picture" /> Выберите изображение
                                    </Button>
                                )}
                            </FormItem>

                            <FormItem>
                                <Button 
                                    type='primary'
                                    htmlType='submit'
                                >Сохранить</Button>
                                { !isCreate &&
                                    <Button
                                        onClick={ e => this.cancelChanges() }
                                    >Отменить изменения</Button>
                                }
                            </FormItem>
                        </Col>
                        <Col sm={24} md={10}>
                            { (category.name || isCreate) && 
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
                            { (category.singularName || isCreate) && 
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
                            { (category.nameUrl || isCreate) && 
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
                            { (category.shortName || isCreate) && 
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
                    <Modal
                        title='Выберите изображение'
                        visible={ showGallery }
                        onOk={ e => this.handleModalGalleryOk() }
                        onCancel={ e => this.handleModalGalleryCancel() }
                    >
                        <Gallery onClickToImage={ fileName => this.handleSelectImage(fileName) } />
                    </Modal>
                </Row>
            )
        } else return ( <Spin/> )        
    }
}

CategoryEditPage.propTypes = {
    type: string
}

const CategoryEditPageForm = Form.create()(CategoryEditPage)
export default CategoryEditPageForm