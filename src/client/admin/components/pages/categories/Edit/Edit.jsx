import React from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router-dom'

import {
    getCategory as getCategoryApi,
    createCategory as createCategoryApi,
    editCategory as editCategoryApi,
    deleteCategory as deleteCategoryApi
} from 'client/admin/api/categories'

import config from 'config/server'
import Gallery from 'client/admin/components/content/Gallery/Gallery.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
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
const Modal = require('antd/lib/modal')
require('antd/lib/modal/style/css')
const Popconfirm = require('antd/lib/popconfirm')
require('antd/lib/popconfirm/style/css')
const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categoryInitial: null,
            category: null,
            showGallery: false,
            selectedImage: null,
            preSelectedImage: null,
            isCreated: false,
            isDeleted: false,
            problemsCounter: 0,
            loadStatus: 'load',
            breadcrumbsLinks: [{ url: '/categories', text:'Категории' }],
            title: null
        }
    }

    emptyCategory(){
        this.setState({
            loadStatus: 'empty',
            breadcrumbsLinks: [
                { url: '/categories', text:'Категории' },
            ]
        })
    }

    getCategory(nameUrl){        
        try {
            return getCategoryApi(nameUrl)
            .then(category => {
                if(!category.error){
                    let maxCount = 0
                    if(category.problems.length > 0 && category.problems[0].id){
                        let maxProblemOnId = _.maxBy(category.problems, problem => {
                            return problem.id
                        })
                        maxCount = maxProblemOnId.id++
                    }
                    this.setState({
                        categoryInitial: category,
                        category: category,
                        problemsCounter: maxCount,
                        loadStatus: 'complete',
                        breadcrumbsLinks: [
                            { url: '/categories', text:'Категории' }, 
                            { url: category.nameUrl, text: category.shortName }
                        ],
                        title: category.shortName
                    }, () => {
                        this.setAllInputs(this.state.category)
                    })
                } else {
                    this.emptyCategory()
                }                    
            })
        } catch(err) {
            this.emptyCategory()
        }
    }

    componentWillMount(){
        if(this.props.type == 'create'){
            const empty = {
                name: '',
                singularName: '',
                nameUrl: '',
                shortName: '',
                problems: []                
            }
            this.setState({
                categoryInitial: empty,
                category: empty,
                loadStatus: 'complete',
                breadcrumbsLinks: [
                    { url: '/categories', text:'Категории' }, 
                    { url: 'create', text: 'Новая категория' }
                ]
            })
        } else {
            const { nameUrl } = this.props.match.params
            this.getCategory(nameUrl)
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match && this.props.match.params){
            const oldNameUrl = this.props.match.params.nameUrl
            const newNameUrl = nextProps.match.params.nameUrl
            if(newNameUrl != oldNameUrl){
                this.getCategory(newNameUrl)
            }
        }        
    }

    componentDidMount(){
        const { getFieldDecorator, getFieldValue }  = this.props.form
        getFieldDecorator('problems', { initialValue: [] })
    }

    async handleSave(e){
        const isCreateType = this.props.type == 'create'

        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(isCreateType){
                    try {
                        return createCategoryApi(values)
                        .then(category => {
                            this.setState({ isCreated: true }, () => {
                                message.success(`Категория ${category.shortName} создана.`)
                            })
                        })
                    } catch(err) {
                        message.error(`Категория ${category.shortName} не создана.`)
                    }
                } else {
                    const { nameUrl } = this.props.match.params
                    try {
                        return editCategoryApi(nameUrl, values)
                        .then(category => {
                            if(!category.error){
                                message.success(`Категория ${category.shortName} отредактирована.`)
                            } else {
                                message.error(`Категория ${category.shortName} не отредактирована.`)
                            }                            
                        })
                    } catch(err) {
                        message.error(`Категория ${category.shortName} не отредактирована.`)
                    }
                }
            } else {
                message.error(`Категория не отредактирована.`)
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
        if(category.problems){
            this.setProblems(category.problems)
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

    removeProblem(id){
        const { category } = this.state
        const newProblems = _.compact(category.problems.map(problem => {
            if(problem.id != id) return problem
        }))
        this.setState({
            category: {
                name: category.name,
                singularName: category.singularName,
                nameUrl: category.nameUrl,
                shortName: category.shortName,
                problems: newProblems
            }
        }, () => {
            this.setProblems()
        })
    }

    addProblemInput(){
        const { category, problemsCounter } = this.state
        let maxCount = problemsCounter + 1
        if(category.problems.length > 0 && category.problems[0].id){
            let maxProblemOnId = _.maxBy(category.problems, problem => {
                return problem.id
            })
            if(maxCount <= maxProblemOnId.id){
                maxCount = maxProblemOnId.id + 1
            }
        }
        this.setState({
            problemsCounter: maxCount,
            category: {
                name: category.name,
                singularName: category.singularName,
                nameUrl: category.nameUrl,
                shortName: category.shortName,
                problems: [...category.problems, {
                    id: this.state.problemsCounter,
                    value: '',
                }]
            }
        })
    }

    setProblems(){
        this.props.form.setFieldsValue({ problems: this.state.category.problems })
    }

    onProblemChange(id, value){
        const { category } = this.state
        const newProblems = category.problems.map(problem => {
            if(problem.id == id){
                return { id, value }
            }
            return problem
        })
        this.setState({
            category: {
                name: category.name,
                singularName: category.singularName,
                nameUrl: category.nameUrl,
                shortName: category.shortName,
                problems: newProblems
            }
        }, () => {
            this.setProblems()
        })
    }

    deleteCategory(){
        const { category } = this.state
        if(category){
            try {
                deleteCategoryApi(category.nameUrl)
                .then(data => {
                    if(data.status == 'OK'){
                        this.setState({ isDeleted: true })
                    }
                })
            } catch(err) {
                message.error(`Категория ${ category.shortName } не удалена.`)
            }    
        }                
    }

    render(){
        const {
            category,
            showGallery,
            selectedImage,
            isCreated,
            isDeleted,
            loadStatus,
            breadcrumbsLinks,
            title
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
                    message='Данной категории не существует'
                >
                    <h1>{ title }</h1>
                    {
                       !isDeleted ?
                        <Form onSubmit = { e => this.handleSave(e) }>  
                            <FormItem>
                                { 
                                    !isCreated &&
                                    <Button
                                        type='primary'
                                        htmlType='submit'
                                    >Сохранить</Button>
                                }
                                { 
                                    !isCreateType &&
                                    <Button
                                        onClick={ e => this.cancelChanges() }
                                    >Отменить изменения</Button>
                                }
                                { 
                                    category && !isCreateType && !isDeleted &&
                                    <Popconfirm
                                        title={ `Удалить категорию ${ category.shortName }?` }
                                        onConfirm={ () => this.deleteCategory() }
                                        onCancel={ null }
                                        okText="Да"
                                        cancelText="Нет"
                                    >   
                                        <Button>
                                            <Icon type='delete' />
                                            Удалить категорию
                                        </Button>                                    
                                    </Popconfirm>                                    
                                }
                            </FormItem>

                            {   (selectedImage || getFieldValue('image')) &&
                                <img src={ `${ config.assetsPath }/imgs/${ selectedImage || getFieldValue('image') }` }/>
                            }

                            <FormItem
                                >
                                {getFieldDecorator('image', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Button
                                        onClick = { e => this.openGallery() }
                                    >
                                        <Icon type="picture" /> Выберите изображение
                                    </Button>
                                )}
                            </FormItem>

                            <FormItem label='Название' className={ l.formItem }>
                                {getFieldDecorator('name', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onNameChange(val) }
                                        placeholder='Например: Ремонт холодильников'
                                    />
                                )}
                            </FormItem>


                            <FormItem label='Название в одиночном числе'  className={ l.formItem }>
                                {getFieldDecorator('singularName', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onSingularNameChange(val) }
                                        placeholder='Например: Ремонт холодильника'
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


                            <FormItem label='Вид техники'  className={ l.formItem }>
                                {getFieldDecorator('shortName', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onShortNameChange(val) }
                                        placeholder='Например: Холодильник'
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Возможные неисправности'  className={ l.formItem }>
                            {
                                (category && category.hasOwnProperty('problems')) 
                                && category.problems.map(problem => {
                                    return (
                                        <div key={ problem.id }>
                                            <Input
                                                placeholder='Название неисправности'
                                                onChange={ e => this.onProblemChange(problem.id, e.target.value)}
                                                value={ problem.value }
                                            />
                                            <Icon
                                                type='delete'
                                                onClick={ () => this.removeProblem(problem.id) }
                                            />
                                        </div>
                                    )
                                })
                            }
                            </FormItem>
                            <FormItem>
                                <Button type='dashed' onClick={ () => this.addProblemInput() }>
                                    <Icon type='plus' /> Добавить неисправность
                                </Button>
                            </FormItem>                        
                        </Form>
                        : category &&
                        <Alert
                            type='info'
                            message={ `Категория ${ category.shortName } успешно удалена.` }
                        />
                    }
                </LoadedContentView>
                <Modal
                    title='Выберите изображение'
                    visible={ showGallery }
                    onOk={ e => this.handleModalGalleryOk() }
                    onCancel={ e => this.handleModalGalleryCancel() }
                >
                    <Gallery
                        onClickToImage={ fileName => this.handleSelectImage(fileName) }
                        inModal={ true }
                    />
                </Modal>
            </Row>            
        )
    }
}

Edit.propTypes = {
    type: string
}

const EditForm = Form.create()(Edit)
export default EditForm
