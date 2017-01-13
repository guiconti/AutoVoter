var request = require('request');
request = request.defaults({jar: true});
jar = request.jar();

var url = '';

exports.vote = (req, res) => {

    var body = _.pick(req.body, 'username', 'password');

        if (!_.isString(body.username) || body.username.trim().length == 0){

            return res.status(400).json({msg: 'Invalid username'});
            
        } else if (!_.isString(body.password) || body.password.trim().length == 0){

            return res.status(400).json({msg: 'Invalid password'});

        } else {

            url = 'https://panel.talonro.com/voting/';

            request.get({url: url}, function(err, httpResponse, html){

                var csrfKeyRegExp = new RegExp(/name="csrfKey" value="([^']*)">/);
                var refRegExp = new RegExp(/name="ref" value="([^']*)">/);

                var csrf = '';
                var ref = '';

                if (!csrfKeyRegExp.test(html)) {

                    return res.status(400).json({
                        msg: 'Erro ao pegar o CSRF para login'
                    });

                } else if (!refRegExp.test(html)){

                    return res.status(400).json({
                        msg: 'Erro ao pegar o CSRF para login'
                    });

                } else {

                    url = 'https://forum.talonro.com/login/';

                    var csrfExpRes = csrfKeyRegExp.exec(html);
                    csrf = csrfExpRes[0].substring(22, 54);

                    var refExpRes = refRegExp.exec(html);
                    ref = refExpRes[0].substring(18, 62);

                    var loginData = {
                        auth: body.username.trim(),
                        password: body.password.trim(),
                        login__standard_submitted: '1',
                        csrfKey: csrf,
                        ref: ref
                    };

                    request.post({url: url, followAllRedirects: true, form: loginData}, function(err, httpResponse, html){

                        url = 'https://panel.talonro.com/voting/';
                        var votingData = {
                            agree_vote: 1
                        };

                        request.post({url: url, followAllRedirects: true, form: votingData}, function(err, httpResponse, html){

                            url = 'https://panel.talonro.com/voting/';
                            var counter = 0;

                            while (counter <= 5){

                                request.get({url: url + counter + '/', followAllRedirects: true}, function(err, httpResponse, html){

                                });

                                counter++;

                            }

                            return res.status(200).json({msg: 'Feito!'});

                        });
                    });
                }
            });
        }
}