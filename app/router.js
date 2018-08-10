import app from './express'
import log, { deSequelize } from '../lib/logger'

import { Sequelize } from '../db/sequelize'
import { Promises, Users } from '../models'
import promiseGallerySort from '../lib/sort'
import { isNewPromise } from '../helpers/calculate'
import { calculateReliability, promisesIncluded } from '../lib/parse/credit'

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getValidPromises().then(promises => {
    const rel = calculateReliability(promises)
    const reliability = rel.score
    const usedPromiseCount = rel.counted

    log.debug(`${req.params.user}'s promises:`, rel.score, promises.length)

    req.user.update({ score: rel.score, counted: rel.counted })

    promises.sort(promiseGallerySort)

    res.render('user', {
      promises,
      user: req.user,
      reliability,
      usedPromiseCount
    })
  })
})

// show promise, or create it via middlware
app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', deSequelize(req.promise))
  res.render('show', {
    promise: req.promise,
    user: req.user,
    isNewPromise: isNewPromise({ promise: req.promise })
  })

  // update click after route has rendered
  res.on('finish', () => {
    req.promise.increment(['clix'], { by: 1 }).then(prom => {
      log.debug('clix incremented', deSequelize(prom))
    })
  })
})

// home
app.get(['/?'], (req, res) => {
  Promises.findAll({
    where: {
      tfin: null,
      void: {
        [Sequelize.Op.not]: true
      },
    }, // only show uncompleted
    // limit: 30
    include: [{
      model: Users
    }],
    order: Sequelize.literal('tini DESC'),
  }).then(function(promises) {
    log.debug('home promises', promises.length)

    res.render('home', {
      promises
    })
  })
})

// placeholder
app.get('/sign-up', (req, res) => {
  log.info('render sign up')
  res.render('signup')
})


// catch-all
app.get('*', (req, res) => {
  log.info('render 404')
  res.render('404', req.originalUrl)
})
