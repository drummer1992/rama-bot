'use strict'

const { SET_GROUP, CREATE_TRAINING, INFO, FORCE, HELP, CREATE_GROUP } = require('./app')
const { HAPPY, ROBO, PLUS } = require('./emoji')

exports.HELP_MESSAGE = `Привіт ${HAPPY}, я Rama Vandama Bot ${ROBO}, ось список моїх, доступних команд:\n\n`
  + `${HELP} - список доступних команд\n`
  + `${SET_GROUP} - встановити групу в якій ви хочете займатися\n`
  + `${CREATE_GROUP} - створити групу\n`
  + `${CREATE_TRAINING} - створити тренування\n`
  + `${INFO} - подивитися інформацію про наступне тренування\n`
  + `${FORCE} - записатися на тренування навіть якщо сьогодні воно не у вашої групи\n`
  + `${PLUS} - записатися на тренування\n`
