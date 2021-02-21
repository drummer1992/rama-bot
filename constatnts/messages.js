'use strict'

const { SET_GROUP, ADD_TRAINING, INFO } = require('./routes')
const { HAPPY, ROBO } = require('./emoji')

exports.ABOUT_MESSAGE = `Привіт ${HAPPY}, я Rama Vandama Bot ${ROBO}, ось список моїх, доступних команд:\n\n`
  + `${SET_GROUP} (назва групи) - встановити групу в якій ви займаєтеся (надалі, групу можна змінювати)\n`
  + `${ADD_TRAINING} (назва групи) (години:хвилини) - якщо Ви тренер, цією командою можна створити тренування вказавши групу та час\n`
  + `${INFO} - подивитися інформацію про наступне тренування\n`