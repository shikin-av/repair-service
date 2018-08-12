import sms from './smsc_api'

import smsConfig from '../../config/smsc.ru'

sms.configure({
    login: 	  smsConfig.login,
    password: smsConfig.password,
    charset:  'utf-8',
})

sms.makeSmsOrderMessage = values => {
    const {
        id,
        dateToView,
        time,
        address,
        apartment,
        phone,
        name,
        categoryShortName,
        description,
        firm,
        howOld,
        problems,
    } = values
    let message = `Заявка № ${ id } : ${ categoryShortName }\n`
    message += dateToView
    if(time) message += `: ${ time }\n`
    if(address) message += address
    if(apartment) message += ` кв. ${ apartment }\n`
    if(phone) message += `Тел: ${ phone }\n`
    if(name) message += `Клиент: ${ name }\n\n`
    if(description) message += `${ description }\n`
    if(firm) message += `Фирма: ${ firm }\n`
    if(howOld) message += `Лет: ${ howOld }\n`
    if(problems && problems.length){
        message += 'Неисправности:\n'
        for(let problem of problems){
            message += `${ problem }\n`
        }
    }
    return message
}

export default sms