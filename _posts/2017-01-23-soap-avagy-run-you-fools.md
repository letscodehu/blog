---
id: 1482
title: 'SOAP, avagy &#8216;Run you fools!&#8217;'
date: '2017-01-23T04:23:06+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1482'
permalink: /2017/01/23/soap-avagy-run-you-fools/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/01/09215850/soap.jpg'
categories:
    - Backend
    - PHP
tags:
    - client
    - envelope
    - laravel
    - php
    - soap
    - webservice
    - wsdl
---

Az eddigi cikkekben főleg a RESTful irányába mentünk el, ami mostanában elterjedőben van, viszont óhatatlan, hogy az ember belefusson a jó öreg SOAP-ba. Már volt róla szó, hogy hogy is néz ki mindez, viszont az még nem derült ki, hogy is tudunk ilyet létrehozni, valamint egy kliens se ártana, mert "jó" esetben mi inkább használni fogjuk ezeket, nem pedig szervert írni rá PHP-ben. Mindenesetre mindkét opcióról szót ejtünk majd. Na de zuhanjunk is neki, mert semmi se lesz belőle![![](assets/uploads/2017/01/soap.jpg)](assets/uploads/2017/01/soap.jpg)

Az első lépés most legyen a kliens, ugyanis szerencsénkre vannak a neten elszórtan olyan webservice-ek, amiket tudunk használni kívülről, ezért nem kell feltétlenül megírjuk a sajátunkat, hogy tesztelni tudjunk. Ez jelen esetben egy időjárással kapcsolatos szolgáltatás lesz, amit [itt](http://www.webservicex.net/globalweather.asmx?WSDL) találtok. Igen, ez egy ún. WSDL fájl, vagyis egy csodás XML, ami leírja, hogy is épül fel ez a webservice, milyen távoli eljáráshívások találhatóak benne, milyen típusokkal dolgozik, de ne rohanjunk előre.

Ahhoz, hogy klienst írjunk, mégpedig a lehető legegyszerűbben, szükségünk lesz a SOAP PHP kiterjesztésre (már aki nem akar kézzel XML-eket összerakni). Ennek telepítését most nem részletezném, van jó [leírás](http://php.net/manual/en/soap.installation.php) róla, pofonegyszerű.

Ha ezzel megvagyunk, akkor megnyílnak előttünk a SOAP sötét bugyrai, a kérdés már csak az, hogy készen állunk-e belevetni magunkat?

Az osztály, amit mi keresünk jelenleg a SoapClient lesz, globális névtérben. Később persze írhatunk rá wrappert is, hiszen eléggé általános felhasználásra van. Na de nézzük mit is tudunk vele kezdeni.

Az első lényeges tudnivaló, hogy kétféle módban tudunk SOAP szervert/klienst létrehozni. Az egyik az WSDL, a másik pedig a non-WSDL mód. Értelemszerűen az egyikhez van WSDL, ami leírja a szolgáltatást, a másik esetben <del>vakon lövöldözünk</del> API doksi alapján mennek a dolgok.

Mivel most van WSDL, ezért nézzük meg a dolgot azzal. A példában egy Laraveles projektben fogom ezt használni, így az első dolog az az, hogy <del>kézzel példányosítjuk egy kontrollerben</del> bebindoljuk azt az `AppServiceProvider.php`-ben:

```
public function register()
{
    $this->app->bind(\SoapClient::class, function() {
        return new \SoapClient("http://www.webservicex.com/globalweather.asmx?WSDL");
    });
}
```

Ezután pedig felveszünk egy sima route-ot, ami meghívja azt, hogy lássuk hogy is működik.

```
Route::get("/", function(SoapClient $client) { // akinek nem tiszta a Laravel, ez a $client ugyanaz, mint a fent létrehozott
  dd($client->__getFunctions());
})
```

Ha meglőjük ezt az URL-t, akkor egy szép 4 elemű tömböt fog nekünk kiírni:

```
array:4 [&#9660;
 0 => "GetWeatherResponse GetWeather(GetWeather $parameters)"
 1 => "GetCitiesByCountryResponse GetCitiesByCountry(GetCitiesByCountry $parameters)"
 2 => "GetWeatherResponse GetWeather(GetWeather $parameters)"
 3 => "GetCitiesByCountryResponse GetCitiesByCountry(GetCitiesByCountry $parameters)"
]
```

Na most a `dd` az egy formázott `var_dump` és `die` kombója. A \_\_getFunctions pedig arra szolgál, hogy kiszedje az elérhető távoli eljáráshívásokat a WSDL alapján. Itt látható, hogy milyen metódusok, milyen paraméterekkel és visszatérési értékekkel elérhetőek. Ez eddig tök jó, viszont egy a bibi. Nem tudjuk, hogy a paraméterként szolgáló objektumoknak milyen fieldjei vannak. Ahhoz, hogy ezt megtudjuk, egy másik hívás szükségeltetik, mégpedig a `__getTypes()`

```
  dd($client->__getTypes());
```

Ennek a kimenete az előbbihez hasonló, megmutatja, hogy az egyes típusok hogy is épülnek fel:

```
array:4 [&#9660;
 0 => """
 struct GetWeather {\n
 string CityName;\n
 string CountryName;\n
 }
 """
 1 => """
 struct GetWeatherResponse {\n
 string GetWeatherResult;\n
 }
 """
 2 => """
 struct GetCitiesByCountry {\n
 string CountryName;\n
 }
 """
 3 => """
 struct GetCitiesByCountryResponse {\n
 string GetCitiesByCountryResult;\n
 }
 """
]
```

Na mostmár tudjuk, hogy mit is kell átpasszolnunk, ha pl. a GetCitiesByCountry-t akarjuk meghívni, tegyük is meg!

```
dd($client->GetCitiesByCountry(["CountryName" => "Hungary"])->GetCitiesByCountryResult);
```

Na most mi is történik itt fent? Meghívjuk a fent megadott távoli eljárást, átpasszolunk neki egy asszociatív tömböt, aminek a fieldjei megegyeznek a szükséges objektum fieldjeivel és a kapott objektumnak pedig lekérjük azt a mezőjét, amiben a válasz található. Na és ez pedig egy böszme nagy XML lesz, természetesen String formájában, amiket aztán kedvünkre parse-olhatunk:

```
\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Békéscsaba</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Budapest Met Center</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Budapest / Ferihegy</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Budaörs</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Debrecen</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Kecskemét</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Kaposvár</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Miskolc</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">  <Table></span>\n
<span class="sf-dump-str" title="1230 characters">    <Country>Hungary</Country></span>\n
<span class="sf-dump-str" title="1230 characters">    <City>Nyiregyháza / Napkor</City></span>\n
<span class="sf-dump-str" title="1230 characters">  </Table></span>\n
<span class="sf-dump-str" title="1230 characters">...</span>
```

Most ettől egyelőre tekintsünk el és nézzük meg, hogy milyen idő van Budapesten!

```
dd($client->GetWeather(["CountryName" => "Hungary", "CityName" => "Budapest Met Center"])->GetWeatherResult);
```

Sajnos nem jártam sikerrel:

```
<pre class="sf-dump" data-indent-pad=" " id="sf-dump-1597500754">"<span class="sf-dump-str" title="14 characters">Data Not Found</span>"
```

Viszont a célunkat elértük, ugyanis egy távoli eljárást hívtunk meg! Na de ez nem volt valami szép, ugye? [![](assets/uploads/2017/01/soap-ingredients.jpg)](assets/uploads/2017/01/soap-ingredients.jpg)Nincs erre valami szebb módszer? Dehogynincs! Mégpedig az, hogy WSDL alapján legeneráltatjuk a szükséges osztályokat és a távoli hívásokat úgy hívjuk majd, mintha lokálisak lennének. A cél, hogy aki használja mindezt, ne vegye észre a kapott interfészből, hogy itt biza valami turpisság van, max. akkor mikor meghívja és a nanomásodpercek helyett tizedmásodpercek alatt válaszol, mert a háttérben egy webservice hívás történik.

A cucc, amit használni fogunk github szinten [itt](https://github.com/wsdl2phpgenerator/wsdl2phpgenerator) található, composerből pedig a

```
composer require wsdl2phpgenerator/wsdl2phpgenerator
```

paranccsal tudjuk előcsalogatni. Ezt a libet csupán addig fogjuk használni, amíg legeneráljuk a szükséges osztályokat. Van egy [CLI tool](https://github.com/wsdl2phpgenerator/wsdl2phpgenerator/releases/download/2.5.5/wsdl2phpgenerator-2.5.5.phar) is, amit szintén használhatunk, ha nem akarunk ezért plusz függőséget lehúzni.

Hozzunk létre egy wsimport.php fájlt a projektünk gyökerében és adjuk meg neki a WSDL-t, amire használni szeretnénk (mivel az iménti WSDL nem ment, ezért az itteni doksiból loptam):

```
include 'vendor/autoload.php'; // composer miatt 

$generator = new \Wsdl2PhpGenerator\Generator();
$generator->generate(
 new \Wsdl2PhpGenerator\Config(array(
 'inputFile' => 'http://www.webservicex.net/CurrencyConvertor.asmx?WSDL',
 'outputDir' => 'app/CurrencyConverter',
 'namespaceName' => 'App\\CurrencyConverter'
 ))
);
```

Ezzel az` app\CurrencyConverter` mappájávba a megfelelő névtérrel be is kerültek a fájlok. A probléma sajnos ott van, hogy külön autoloadert generált neki, amit a se a composer, se a laravel nem lát, ezért azt valahova bele kell barkácsolni, Laravel esetén pl. a `bootstrap/autoload.php`-be, vagy composer esetén a `vendor/autoload.php`-be:

```
require __DIR__. '/../app/CurrencyConverter/autoload.php';

```

Na de nézzük csak meg a generált fájlokat!

A `Currency` az egy hatalmas enum, illetve annak PHP megfelelője, egy osztály rahedli konstanssal:

```
class Currency
{
    const __default = 'AFA';
    const AFA = 'AFA';
    const ALL = 'ALL';
    const DZD = 'DZD';
    const ARS = 'ARS';
    const AWG = 'AWG';
    const AUD = 'AUD';
    const BSD = 'BSD';
...
```

A `ConversionRate` egy szimpla DTO, ami két `Currency`-t foglal magába a hozzájuk szükséges getter/setterekkel:

```
class ConversionRate
{

    /**
     * @var Currency $FromCurrency
     */
    protected $FromCurrency = null;

    /**
     * @var Currency $ToCurrency
     */
    protected $ToCurrency = null;
...
```

A `ConversionRateResponse` pedig a válasz DTO-ja, amiben egy float érték érkezik az átváltási arányokkal:

```
class ConversionRateResponse
{

    /**
     * @var float $ConversionRateResult
     */
    protected $ConversionRateResult = null;
...
```

Maga a kliens a CurrencyConvertor (typo?) lesz:

```
class CurrencyConvertor extends \SoapClient
{

    /**
     * @var array $classmap The defined classes
     */
    private static $classmap = array (
      'ConversionRate' => 'App\\CurrencyConverter\\ConversionRate',
      'ConversionRateResponse' => 'App\\CurrencyConverter\\ConversionRateResponse',
    );

    /**
     * @param array $options A array of config values
     * @param string $wsdl The wsdl file to use
     */
    public function __construct(array $options = array(), $wsdl = null)
    {
      foreach (self::$classmap as $key => $value) {
        if (!isset($options['classmap'][$key])) {
          $options['classmap'][$key] = $value;
        }
      }
      $options = array_merge(array (
      'features' => 1,
          'trace' => 1,
    ), $options);
      if (!$wsdl) {
        $wsdl = 'http://www.webservicex.net/CurrencyConvertor.asmx?WSDL';
      }
      parent::__construct($wsdl, $options);
    }

    /**
     * <br><b>Get conversion rate from one currency to another currency <b><br><p><b><font color='#000080' size='1' face='Verdana'><u>Differenct currency Code and Names around the world</u></font></b></p><blockquote><p><font face='Verdana' size='1'>AFA-Afghanistan Afghani<br>ALL-Albanian Lek<br>DZD-Algerian Dinar<br>ARS-Argentine Peso<br>AWG-Aruba Florin<br>AUD-Australian Dollar<br>BSD-Bahamian Dollar<br>BHD-Bahraini Dinar<br>BDT-Bangladesh Taka<br>BBD-Barbados Dollar<br>BZD-Belize Dollar<br>BMD-Bermuda Dollar<br>BTN-Bhutan Ngultrum<br>BOB-Bolivian Boliviano<br>BWP-Botswana Pula<br>BRL-Brazilian Real<br>GBP-British Pound<br>BND-Brunei Dollar<br>BIF-Burundi Franc<br>XOF-CFA Franc (BCEAO)<br>XAF-CFA Franc (BEAC)<br>KHR-Cambodia Riel<br>CAD-Canadian Dollar<br>CVE-Cape Verde Escudo<br>KYD-Cayman Islands Dollar<br>CLP-Chilean Peso<br>CNY-Chinese Yuan<br>COP-Colombian Peso<br>KMF-Comoros Franc<br>CRC-Costa Rica Colon<br>HRK-Croatian Kuna<br>CUP-Cuban Peso<br>CYP-Cyprus Pound<br>CZK-Czech Koruna<br>DKK-Danish Krone<br>DJF-Dijibouti Franc<br>DOP-Dominican Peso<br>XCD-East Caribbean Dollar<br>EGP-Egyptian Pound<br>SVC-El Salvador Colon<br>EEK-Estonian Kroon<br>ETB-Ethiopian Birr<br>EUR-Euro<br>FKP-Falkland Islands Pound<br>GMD-Gambian Dalasi<br>GHC-Ghanian Cedi<br>GIP-Gibraltar Pound<br>XAU-Gold Ounces<br>GTQ-Guatemala Quetzal<br>GNF-Guinea Franc<br>GYD-Guyana Dollar<br>HTG-Haiti Gourde<br>HNL-Honduras Lempira<br>HKD-Hong Kong Dollar<br>HUF-Hungarian Forint<br>ISK-Iceland Krona<br>INR-Indian Rupee<br>IDR-Indonesian Rupiah<br>IQD-Iraqi Dinar<br>ILS-Israeli Shekel<br>JMD-Jamaican Dollar<br>JPY-Japanese Yen<br>JOD-Jordanian Dinar<br>KZT-Kazakhstan Tenge<br>KES-Kenyan Shilling<br>KRW-Korean Won<br>KWD-Kuwaiti Dinar<br>LAK-Lao Kip<br>LVL-Latvian Lat<br>LBP-Lebanese Pound<br>LSL-Lesotho Loti<br>LRD-Liberian Dollar<br>LYD-Libyan Dinar<br>LTL-Lithuanian Lita<br>MOP-Macau Pataca<br>MKD-Macedonian Denar<br>MGF-Malagasy Franc<br>MWK-Malawi Kwacha<br>MYR-Malaysian Ringgit<br>MVR-Maldives Rufiyaa<br>MTL-Maltese Lira<br>MRO-Mauritania Ougulya<br>MUR-Mauritius Rupee<br>MXN-Mexican Peso<br>MDL-Moldovan Leu<br>MNT-Mongolian Tugrik<br>MAD-Moroccan Dirham<br>MZM-Mozambique Metical<br>MMK-Myanmar Kyat<br>NAD-Namibian Dollar<br>NPR-Nepalese Rupee<br>ANG-Neth Antilles Guilder<br>NZD-New Zealand Dollar<br>NIO-Nicaragua Cordoba<br>NGN-Nigerian Naira<br>KPW-North Korean Won<br>NOK-Norwegian Krone<br>OMR-Omani Rial<br>XPF-Pacific Franc<br>PKR-Pakistani Rupee<br>XPD-Palladium Ounces<br>PAB-Panama Balboa<br>PGK-Papua New Guinea Kina<br>PYG-Paraguayan Guarani<br>PEN-Peruvian Nuevo Sol<br>PHP-Philippine Peso<br>XPT-Platinum Ounces<br>PLN-Polish Zloty<br>QAR-Qatar Rial<br>ROL-Romanian Leu<br>RUB-Russian Rouble<br>WST-Samoa Tala<br>STD-Sao Tome Dobra<br>SAR-Saudi Arabian Riyal<br>SCR-Seychelles Rupee<br>SLL-Sierra Leone Leone<br>XAG-Silver Ounces<br>SGD-Singapore Dollar<br>SKK-Slovak Koruna<br>SIT-Slovenian Tolar<br>SBD-Solomon Islands Dollar<br>SOS-Somali Shilling<br>ZAR-South African Rand<br>LKR-Sri Lanka Rupee<br>SHP-St Helena Pound<br>SDD-Sudanese Dinar<br>SRG-Surinam Guilder<br>SZL-Swaziland Lilageni<br>SEK-Swedish Krona<br>TRY-Turkey Lira<br>CHF-Swiss Franc<br>SYP-Syrian Pound<br>TWD-Taiwan Dollar<br>TZS-Tanzanian Shilling<br>THB-Thai Baht<br>TOP-Tonga Pa'anga<br>TTD-Trinidad&amp;amp;Tobago Dollar<br>TND-Tunisian Dinar<br>TRL-Turkish Lira<br>USD-U.S. Dollar<br>AED-UAE Dirham<br>UGX-Ugandan Shilling<br>UAH-Ukraine Hryvnia<br>UYU-Uruguayan New Peso<br>VUV-Vanuatu Vatu<br>VEB-Venezuelan Bolivar<br>VND-Vietnam Dong<br>YER-Yemen Riyal<br>YUM-Yugoslav Dinar<br>ZMK-Zambian Kwacha<br>ZWD-Zimbabwe Dollar</font></p></blockquote>
     *
     * @param ConversionRate $parameters
     * @return ConversionRateResponse
     */
    public function ConversionRate(ConversionRate $parameters)
    {
      return $this->__soapCall('ConversionRate', array($parameters));
    }

}
```

Látjuk is, hogy igazából a korábban stringként látott hívásokat valósítja meg, a szükséges paraméterekkel. Akkor próbáljuk ki!

```
Route::get("/", function(\App\CurrencyConverter\CurrencyConvertor $currencyConvertor) {
    $conversionRate = new \App\CurrencyConverter\ConversionRate(\App\CurrencyConverter\Currency::HUF, \App\CurrencyConverter\Currency::USD);
    dd($currencyConvertor->ConversionRate($conversionRate)->getConversionRateResult());
})
```

Láthatjuk, hogy ez már pár fokkal szebben fest, hiszen nem magic metódusokat kell hívogatnunk, nem kell aggódni a typo-k miatt, mert legenerálja számunkra az opciókat, így közelebb kerülünk a típusosság felé.

Na de mi történik ilyenkor a háttérben? Mégis, mi az a SOAP? Kicsit magasról indultunk és nem árt, ha tudjuk, hogy a háttérben mi zajlik. Persze nem fogunk belemenni abba, hogy is készül a WSDL 🙂

A lényegét tekintve a SOAP hívás egy HTTP protokollon (létezik másféle protokollon közlekedő SOAP is, pl. SMTP, JMS, de remélem azok már kihaltak) át küldött POST body-ba zsúfolt XML üzenet. A neve a *Simple Object Access Protocol-*ból ered, habár sok mindent el lehet róla mondani azt leszámítva, hogy simple 🙂

Amikor a kliensünk elküldött egy üzenetet a szerver felé, az nagyjából így nézett ki:

```
<span class="nf">POST</span> <span class="nn">/CurrencyConvertor.asmx</span> <span class="kr">HTTP</span><span class="o">/</span><span class="m">1.1</span>
<span class="na">Host</span><span class="o">:</span> <span class="l">www.webservicex.net</span>
<span class="na">Content-Type</span><span class="o">:</span> <span class="l">application/soap+xml; charset=utf-8</span>
<span class="na">Content-Length</span><span class="o">:</span> <span class="l">299</span>
<span class="na">SOAPAction</span><span class="o">:</span> <span class="l">"http://www.w3.org/2003/05/soap-envelope"</span>

<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.webserviceX.NET/">
<span class="sf-dump-str" title="326 characters"> <SOAP-ENV:Body>
  <ns1:ConversionRate>
   <ns1:FromCurrency>HUF</ns1:FromCurrency>
   <ns1:ToCurrency>USD</ns1:ToCurrency>
  </ns1:ConversionRate>
 </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
</span>
```

A SOAP üzeneteke struktúrája elég kötött és az alábbi struktúrát követi:

[![](assets/uploads/2017/01/soapstruct.jpg)](assets/uploads/2017/01/soapstruct.jpg)

Tehát az Envelope része a Header, a Body, valamint opcionálisan a Body-ban a Fault elementek, ha esetleg valami gixer van a válasz során. A kérések és a válaszok egyaránt ezt a struktúrát követik. A válaszunk az iménti kérésre a következő volt:

```
<pre class="sf-dump" data-indent-pad=" " id="sf-dump-194527236"><span class="sf-dump-str" title="382 characters"><?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
 <soap:Body>
  <ConversionRateResponse xmlns="http://www.webserviceX.NET/">
   <ConversionRateResult>0.0034</ConversionRateResult>
  </ConversionRateResponse>
 </soap:Body>
</soap:Envelope></span>
```

A válasz hasonló, de most jön a legjobb része: ezzel nekünk **nem kell törődjünk**, mert a SOAP kiterjesztés és az imént telepített library megoldja helyettünk, így aki a WSDL-ek, XML sémák és azok validálása miatt van itt, annak sajnos rossz hírekkel kell szolgáljak.

Apropó SOAPFault! Az ilyen hibák a SoapClientből rendes kivételként érkezik meg hozzánk, ahol azt elkaphatjuk egy try-catch blokkban:

```
$conversionRate = new \App\CurrencyConverter\ConversionRate(\App\CurrencyConverter\Currency::HUF, \App\CurrencyConverter\Currency::USD);
try {
    $currencyConvertor->Conversionate($conversionRate);
} catch(SoapFault $fault) {
    dd($fault->getMessage());
}
```

A fenti példában elírtuk a metódus nevét, amit meghívunk. Ez ugyanúgy kiköt a SoapClient::\_\_call magic metódjánál, viszont a szerveroldalon ezzel nem tud mit kezdeni majd. Hibát dob, ami hiba megjelenik a mi oldalunkon is és el tudjuk azt kapni.

```
<pre class="sf-dump" data-indent-pad=" " id="sf-dump-1990250203"><span class="sf-dump-str" title="65 characters">Function ("Conversionate") is not a valid method for this service<a href="assets/uploads/2016/12/epicsadpuppy.jpg"><img alt="" class=" wp-image-1412 aligncenter" decoding="async" height="425" loading="lazy" sizes="(max-width: 295px) 100vw, 295px" src="assets/uploads/2016/12/epicsadpuppy.jpg" srcset="assets/uploads/2016/12/09202351/epicsadpuppy.jpg 624w, assets/uploads/2016/12/09202351/epicsadpuppy-208x300.jpg 208w" width="295"></img></a></span>
```

Ízelítőnek egyelőre ennyit a SOAP-ról, később megnézzük hogy is tudunk szervert készíteni és hozzá [WSDL-t kreálni](https://packagist.org/packages/georgo/wsdl-creator), amint kijavították a hibát, amit találtam benne 🙂
