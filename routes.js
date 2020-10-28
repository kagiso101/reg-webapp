
module.exports = function regRoutes(reg) {

    async function home(req, res, next) {
        try {
            var all = await reg.allReg()
            res.render('home', {
                regNumb: all
            });

        } catch (err) {
            next(err)
        }
    }

    async function add(req, res, next) {
        var numb = req.body.regInput
        var capital = numb.toUpperCase()
        try {
            if (capital !== "") {
                if (/C[AYJ] \d{3,6}$/.test(capital)) {
                    if (await reg.regExists(capital) === 0) {
                        await reg.addReg(capital)
                        req.flash('success', 'SUCCESS!')
                    }else {
                        req.flash('error', 'registration already entered!')
                    }
                }
                else {
                    req.flash('error', 'enter a valid registration!')
                }
            }
            else {
                req.flash('error', 'please enter a registration!')
            }



            // if () {
            // }
            var all = await reg.allReg()
            res.render('home', {
                regNumb: all
            })


        } catch (err) {
            next(err);
        }
    }
    async function filter(req, res, next) {
        var filter = req.query.filter
        try {
            const filtering = await reg.filterReg(filter)
            res.render('home', {
                regNumb: filtering
            })

        } catch (err) {
            next(err)
        }
    }
    async function clear(req, res, next) {
        try {
            await reg.clear()
            res.render('home')
        } catch (err) {
            next(err)
        }
    }


    return {
        home,
        add,
        filter,
        clear
    }
}
