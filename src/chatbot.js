export const chatbot = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>NHS Support Assistant for Coronavirus</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>

  <script id="ORRWC_MAIN" src="https://master.rwc.staging.onereach.ai/dist/1.0/rwc.js"></script>
  <script>
  $(document).ready(function() {
      ORRWC.Initialize({"Theme":"",
       "StartOpen":true,
       "SaveState":0,
       "BotIcon":"https://s3.eu-west-2.amazonaws.com/www.connect.nhs.uk/covid19/nhs-bot-icon.svg",
       "Type":"StandAlone",
       "AccountId":"848aec97-a481-489c-93bc-94c42a5f24b5",
       "WebHook":{"url":"https://sdkapi.nhs-nelcsu.api.onereach.ai/http/05b52cfa-4af5-48de-8409-90bba2715139/chat?ChatId=nhscovid19-v13"},
       "Logo":"https://s3.eu-west-2.amazonaws.com/www.connect.nhs.uk/covid19/nhs-logo.svg",
       "Events":{"Request":"function(Event){Event.EventData.Location = window.location; Event.Done();}"},
       "Styles":["https://files.staging.api.onereach.ai/public/848aec97-a481-489c-93bc-94c42a5f24b5/nhs_rwc1.css"]
     });
   });
  </script>

  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://googletagmanager.com/gtag/js?id=UA-165837625-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-165837625-1');
  </script>

</body>
</html>`;
