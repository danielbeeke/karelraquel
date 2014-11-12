define(['jquery', 'twig', 'database'], function ($, twig, database) {
  var twigTemplates = {};

  var translations = {
    'en': {
      'Menu': 'Menu',
      'I': 'I',
      'Save the date': 'Save the date',
      'My account': 'My account',
      'Logout': 'Logout',
      'Login': 'Login',
      'Email address': 'Email address',
      'Password': 'Password',
      'Current password': 'Current password',
      'Repeat password': 'Repeat password',
      'Save': 'Save',
      'and': 'and',
      'will be going': 'will be going',
      'to the wedding in Spain on the 6th september': 'to the wedding in Spain on the 6th september',
      'to the wedding in the Netherlands on 4th october': 'to the wedding in the Netherlands on 4th october',
      'will not be going': 'will not be going',
      'Forgot password?': 'Forgot password?',
      'Recover': 'Recover',
      'Recovery': 'Recovery',
      'Goto login': 'Goto login'
    },
    'es': {
      'Menu': 'Menú',
      'I': 'yo',
      'Save the date': 'Reserva la fecha',
      'My account': 'Mi cuenta',
      'Logout': 'Salir',
      'Login': 'Iniciar sesión',
      'Email address': 'Direccion de email',
      'Password': 'Contraseña',
      'Current password': 'Contraseña actual',
      'Repeat password': 'Repetir contraseña',
      'Save': 'Guardar',
      'and': 'y',
      'will be going': 'asistire',
      'to the wedding in Spain on the 6th september': 'a la boda en España el dia 6 de septiembre',
      'to the wedding in the Netherlands on 4th october': 'a la boda en Holanda el dia 4 de octubre',
      'will not be going': 'no asistire',
      'Forgot password?': '¿Olvidó la contraseña?',
      'Recover': 'Recuperar',
      'Recovery': 'Recuperación',
      'Goto login': 'Ir a iniciar sesión'
    },
    'nl': {
      'Menu': 'Menu',
      'I': 'Ik',
      'Save the date': 'Houdt de dag vrij',
      'My account': 'Mijn account',
      'Logout': 'Uitloggen',
      'Login': 'Inloggen',
      'Email address': 'Email adres',
      'Password': 'Wachtwoord',
      'Current password': 'Huidige wachtwoord',
      'Repeat password': 'Herhaal wachtwoord',
      'Save': 'Opslaan',
      'and': 'en',
      'will be going': 'komt',
      'to the wedding in Spain on the 6th september': 'naar de bruiloft in Spanje op 6 September',
      'to the wedding in the Netherlands on 4th october': 'naar de bruiloft in Nederland op 4 Oktober',
      'will not be going': 'komt niet',
      'Forgot password?': 'Wachtwoord vergeten?',
      'Recover': 'Herstel',
      'Recovery': 'Herstellen',
      'Goto login': 'Ga naar inlog'
    }
  }

  twig.extendFunction('t', function(val) {

    var config = database.getConfig()

    if (translations[config.language][val]) {
      return translations[config.language][val]
    }
    else {
      return val;
    }
  });

  return {
    get: function (templateName, object) {

      if (!twigTemplates[templateName]) {
        twigTemplates[templateName] = true
        twig.twig({
            id: templateName,
            href: 'templates/' + templateName + '.html',
            async: false
        })
      }

      return twig.twig({ ref: templateName }).render(object);
    }
  }

});
