---
id: 1224
title: 'Konstruáljunk Web API-t!'
date: '2016-08-26T17:32:48+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1224'
permalink: /2016/08/26/konstrualjunk-web-api-t-2/
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/08/09202216/api.png'
categories:
    - Backend
    - PHP
    - Zend
tags:
    - api
    - apigility
    - php
    - rest
    - rpc
    - soap
    - zend
---

Amikor a legtöbben meghallják azt a rövidítést, hogy API, rendkívül különféle dolgokra asszociálnak. Van akinek a Java Persistence API jut eszébe, van akinek a Facebook API, míg másoknak valami teljesen más...[![api](assets/uploads/2016/08/api.png)](assets/uploads/2016/08/api.png)

Na de mit is jelent maga a rövidítés?

Az API, az alkalmazás-programozási interfész rövidítése hivatott lenni, de aki eddig nem tudta mi az, azt most se hoztam közelebb a valósághoz. Ha az API kifejezést használjuk, akkor egy program azon funkcióit vagy szolgáltatásait soroljuk ide, amiket kívülről meg tudunk hívni és mindennek használatáról <del>jó esetben</del> dokumentáció is született. A lényeg, hogy nekünk nem kell tudnunk mi is történik a mélyben, mi csak használjuk a program nyújtotta szolgáltatásokat. Az előző példákat használva, a JPA (Java Persistence API) során nem kell tudnunk, hogy is kapcsolódik az adatbázishoz, hogy is menti le az entitásokat, stb. nekünk csak használni kell azt. Ugyanez van a Facebook API-val is. Nem tudjuk miben van tárolva az adat és nem tudjuk hol is van az, mi csak meghívunk egy webes URL-t adott paraméterrel és payloaddal és bumm, magic.

Mindezt használhatjuk egyazon programnyelvben is, amikor is létrehozunk egy csomagot, amit mások tudnak használni egy publikus API-n keresztül, de lehetséges mindez webes API-kon át.

Láthatjuk, hogy az egész kissé képlékeny, ezért nézzünk egy-egy példát.

Tegyük fel, hogy létrehoztunk egy tuti form validáló lib-et, amit boldogan használunk a saját kis applikációnkban. Egy idő után úgy döntünk, hogy jófejek leszünk és mindezt megosztjuk az open-source közösséggel. Felkerül packagist-re (vagy bárhova), a kód github-ra is. A githubos readme-ben szépen le van írva, hogy is tudják az emberek használni azt, tehát dokumentáltuk az API-t, amin keresztül el tudják érni a csomag nyújtotta szolgáltatásokat. Aki csak lehúzza azt magának függőségként, annak nem kell ismernie, hogy is működik, csak annyit kell tudnia, hogy mely publikus metódusokon keresztül éri el és azokat hogy kell használni. Emlékszünk még a facade [patternre]({{ site.url }}/2016/04/04/facade-pattern/), ugye?

A másik opció, hogy készítettünk egy oldalt, ahol az emberek különféle csoportokat tudnak létrehozni, azokon belül pedig mindenféle szavazásokat csinálni. Így már legalább 100 scrum team létrehozott nálunk egy Slacker of the day szavazást, ahova gyűlik az infó. Na most ez eddig tök jó, viszont az oldalunk nagyon nem reszponzív, de megkeresnek minket, hogy csinálnának hozzá egy mobilapplikációt, csak nincs webes API hozzáírva. Na most backenddel jobban vagyunk, mint a design-al, így ismét csúcsra járatjuk a jófejségünket és írunk hozzá egy ún. REST (erről majd később) API-t, amin át a mobilapplikációkkal (vagy éppen egy másik webalkalmazással) is el tudják érni az oldalunk nyújtotta szolgáltatásokat, tehát tudnak majd szavazni, lekérdezni, stb.

Azért, hogy kicsit visszazuhanjunk az egyszerű valóságba, akkor jöjjön az, hogy aki bármit piszkált PHP-vel SQL adatbázisokban, az a PHP egyik MySQL kapcsolatokért felelős API-ját használta (mysql, mysqli, PDO).

Na de a mai témánk most a webes API lesz, ezért beszéljünk erről egy kicsit. Jelen esetben az API dokumentációja azt írja le, hogy is tudjuk piszkálni a szolgáltatásokat: milyen URI-n át, milyen HTTP metódusokkal, mi legyen a query stringben, milyen header-ökkel, mit küldjünk a request body-ban és milyen formában kapunk majd választ.

A web API-knak alapvetően két nagy formáját különböztetjük megy, az RPC (remote procedure call) és REST (representational state transfer) API-t.

#### RPC[![RPC-diagram](assets/uploads/2016/08/RPC-diagram.jpg)](assets/uploads/2016/08/RPC-diagram.jpg)

RPC esetében az esetek többségében egyetlen URI-t hivogatunk, mégpedig POST metódussal. Az, hogy mi is a cél, azt a küldött payload határozza meg. Ez általában egy struktúrált kérés, amiben benne lesz az adott művelet neve, valamint a paraméterek. Itt két módszert különböztetünk meg, XML-RPC-t és SOAP-ot. Ez utóbbiról regényeket lehetne írni, így arról most nem írnék, de ha lesz érdeklődés, akkor szívesen taglalom majd egy bejegyzés során. De nézzünk egy példát:

```
POST /xml-rpc HTTP/1.1
Content-Type: text/xml

<?xml version="1.0" encoding="utf-8"?>
<methodCall>
 <methodName>level.up</methodName>
  <params>
   <param>
     <value><integer>40</integer></value>
   </param>
  </params>
</methodCall>
```

A fenti példában egy POST kérést küldünk a /xml-rpc végpontra, a fent látható XML request body-val. Jól látszi, hogy a level.up metódust szeretnénk meghívni egy integer paraméterrel. A gyakorlatban ez egyszerűen egy osztály egy adott metódusára mappelődik, hasonlóképpen:

```
class Level {
   public function up($level) {
        // black magic, ezt már az API használója nem tudja mit hogyan csinál 
   }
}
```

A fenti kérésre, miutá a handler osztályunk feldolgozta azt, hasonló válasz érkezhet:

```
HTTP/1.1 200 OK 
Content-Type: text/xml 
<?xml version="1.0" encoding="utf-8"?> 
<methodResponse> 
  <params> 
   <param> 
    <value><boolean>true</boolean></value> 
   </param> 
  </params> 
</methodResponse>
```

Látjuk, hogy a szintlépés sikeres volt, bármit is jelentsen az a mostani példában 🙂 A lényeg, hogy hasonlóképpen működik, mintha csak a kódunkban hívnánk meg egy osztályunk egy metódusát, csak ezt egy távoli gépen tesszük, ennélfogva erőforrásigényesebb és lassabb lesz az.

Akkor nézzük, hogy összefoglalva mit tudunk az RPC-ről?

- Egy végponton át, többféle művelet
- POST kéréseket használ
- Struktúrált request/response
- Nincs HTTP caching, a HTTP válaszkódból nem állapítható meg, hogyha hiba volt, mindenképp vizsgálni kell azt
- Nem használja ki a HTTP protokoll lehetőségeit

#### REST

A REpresentational State Transfer egy teljesen más megközelítése a dolgoknak. A lényege, hogy itt az adatbázisban szereplő entitások reprezentációja közlekedik. A HTTP protokollra épül, ezáltal próbálja annak minden szolgáltatását kihasználni, úgy mint:

- Több végpont, minden URI egyedileg azonosítja az erőforrásokat.
- A HTTP protokoll több metódusát használja
- A kliensek megadhatják az általuk használt formátumot
- Összekapcsolhatunk erőforrásokat, ezzel jelezve a kapcsolatot köztük
- Alkalmazza az erőforrások cache-elését
- Az egyes műveletek során linkeket is biztosít, hogy a kliens tudja mit is tud tenni ezután

Az RPC-vel szemben ez csupán iránymutatás, nincs kőbe vésve, hogy is kell mindezt implementálni, így egy REST API tervezésekor döntések tömkelegét kell meghoznunk:

- Milyen formában fogjuk reprezentálni az adatainkat?
- Ha egy kérést nem tudunk teljesíteni, akkor azt hogy közöljük a klienssel?
- Ha valami hiba történt, ezt milyen formában adjuk tovább, milyen HTTP status code-okkal?
- Hogy fogunk authentikálni? A HTTP stateless protokoll és habár a session sütik segítségünkre vannak a mindennapi böngészés során, de ezek használata itt nem javallott. Tehát HTTP-vel, OAuth-al vagy API tokennel fogunk authentikálni?

Pont emiatt a lazaság miatt, a REST rendkívül rugalmas és bővíthető, habár ugyanezért elég sok feladatot ró a fejlesztőre, hogy ezeket "megálmodja".

Az előző [cikkemben]({{ site.url }}/2016/07/23/cross-platform-mobilosodas-1-resz/) egy hibrid mobilapplikációt készítettünk, ami statikus adatokat használt. Most jöjjön az, hogy megírjuk a hozzá tartozó backendet, hogy valahol az ottani módosításokat letároljuk. Az egyszerűtől fogunk indulni, szimplán todo-kat szolgálunk ki, lehetővé tesszük azok módosítását, törlését, hozzáadását. Azután bevezetünk egy OAuth2-es authentikációt, az egyes todokat listába szervezzük, a listákat emberekhez rendeljük, ahogy azt a Wunderlist is csinálja.

#### Apigility

A fentiekhez nem mást, mint a Zend csapata által készített [Apigility](https://apigility.org/)-t fogjuk használni. Ez egy webes API builder tool, amivel könnyedén tudjuk összekattintgatni az API nagy részét, ezáltal sok terhet levesz a vállunkról. Ráadásul nem csak Zend keretrendszerbe tudjuk a kapott kódot beilleszteni, hanem máshova is.

Kezdjük azzal, hogy letöltjük azt [innen](https://github.com/zfcampus/zf-apigility-skeleton/releases/download/1.4.0/zf-apigility-skeleton-1.4.0.tgz).

Csomagoljuk ki valahova és vagy állítsunk a public mappára egy VHOST-ot, vagy szimplán a projekt gyökeréből indítsunk egy PHP-s built-in webszervert:

```
$ php -S 0.0.0.0:8888 -t public public/index.php
```

Ezután csapjuk fel a localhost:8888-at és nézzük miből élünk!

> A module mappára adjunk írási jogot a webszerver felhasználójának, különben a scaffolding nem fog menni!

A felületen fogad pár menüpont felül:

- Content negotiation: itt lehet testreszabni az általunk kezelt formátumokat, hogy mely content-type-ra, mivel is reagáljunk.
- Authentication : itt lehet felvenni/szerkeszteni az authentikációs adapterjeinket
- Database : ha már meglévő adatbázishoz kapcsolódunk, itt tudjuk felvenni az ahhoz tartozó kapcsolatot (ez fontos lesz majd nekünk)
- Documentation : a generált/általunk kitöltött adatok alapján összeállított API dokumentációt találhatjuk itt.
- Package: az elkészült API-t itt tudjuk valamilyen formában becsomagolni a későbbi deployra
- About: az aminek látszik

A sidebaron láthatjuk, hogy fel tudunk venni új API-t, ezért hozzunk is létre egyet. Ez a module mappában fog létrehozni egy modult a számunkra és ezt tudjuk majd később becsomagolni. Legyen a neve mondjuk TodoBackend.[![Selection_003](assets/uploads/2016/08/Selection_003.png)](assets/uploads/2016/08/Selection_003.png)

Itt láthatjuk az API-t védő authentikációt, a hozzá tartozó REST és RPC szolgáltatásokat (egyelőre 0), valamint egy igen fontos dolgot, mégpedig a verziót. Ez fontos lehet, ha supportálni akarunk régebbi klienseket is, ahogy az alkalmazás változik.

Ha ezzel kész vagyunk, akkor jöjjön az, ami igazán meggyorsíthatja majd a dolgunkat!

Először is hozzunk létre egy adatbázist és adjunk hozzá egy felhasználót a megfelelő jogosultságokkal!

```
CREATE DATABASE todo COLLATE utf8_hungarian_ci;
CREATE USER 'todo'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON todo.* TO 'todo'@'localhost';
```

Hozzuk létre a todos táblát:

<div class="ui-dialog-content ui-widget-content" id="ui-id-14"><div class="preview_sql"><div class="sqlOuter">```
<pre class="sql-highlight cm-s-default"><span class="cm-keyword">CREATE</span> <span class="cm-keyword">TABLE</span> <span class="cm-variable-2">`todo`</span>.<span class="cm-variable-2">`todo`</span> ( <span class="cm-variable-2">`id`</span> <span class="cm-builtin">BIGINT</span> <span class="cm-keyword">NOT</span> <span class="cm-atom">NULL</span> <span class="cm-keyword">AUTO_INCREMENT</span> ,<span class="cm-variable-2">`name`</span> <span class="cm-builtin">VARCHAR</span>(<span class="cm-number">100</span>) <span class="cm-keyword">NOT</span> <span class="cm-atom">NULL</span> , <span class="cm-variable-2">`done`</span> <span class="cm-builtin">BOOLEAN</span>, <span class="cm-keyword">PRIMARY</span> <span class="cm-keyword">KEY</span> (<span class="cm-variable-2">`id`</span>)) <span class="cm-keyword">ENGINE</span> = <span class="cm-keyword">InnoDB</span>
```

</div>```
<pre class="sql-highlight cm-s-default"><span style="font-family: Georgia, 'Times New Roman', 'Bitstream Charter', Times, serif; line-height: 1.5;">Ha ez megvan, akkor jöhet egy kis mágia!</span>
```

</div></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Menjünk a már korábban említett Database menüpontra és adjunk hozzá egy új db adaptert, pl. local MySQL néven. Használjuk a PDO_Mysql drivert, a todo adatbázist a megfelelő userrel/jelszóval és okézzuk le.</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div>> <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">A Charset mezőben az utf8-at írva default azt fogja használni, ezzel elkerüljük a kódolási gondokat</div>

<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">[![Selection_004](assets/uploads/2016/08/Selection_004.png)](assets/uploads/2016/08/Selection_004.png)</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Most menjünk a TodoBackend API-ra és adjunk hozzá egy új service-t, mégpedig a DB Connected fülről. Itt válasszuk ki az imént létrehozott adaptert és ha mindent jól csináltunk, akkor bizony feldobja nekünk a todos táblát, a megfelelő fieldekkel. Csekkoljuk be mellette a checkboxot és save.[![Selection_005](assets/uploads/2016/08/Selection_005.png)](assets/uploads/2016/08/Selection_005.png)</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Na most meg is jelent a bal oldali listában, hogy ez alá az API alá tartozik egy todo nevű szolgáltatás. Ha megnyitjuk, akkor látjuk, hogy mindezt a /todo[/:todo_id] URL-re mappelte.[![Selection_006](assets/uploads/2016/08/Selection_006.png)](assets/uploads/2016/08/Selection_006.png)</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Na várjunk csak, akkor ez most működik is? Ennyi lenne egy egyszerű REST szolgáltatást csinálni? Próbáljuk ki!</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div>> <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Kétféle végpontot különböztetünk meg alapvetően. Az egyik az egész collection-t azonosítja, ez lesz esetünkben a /todo, míg a másik fajta kérés egy adott entitást azonosít, itt a /todo/[identifier] lesz az adott URI. Az elvégzendő művelet függ mindkettőtől. Egy GET kérést indítva a collection-re, az egész collection-t szeretnénk lekérni, míg mindez egy entitás esetében az adott entitást adja vissza. Ha DELETE-el hívjuk meg az entitást, akkor az törölni fogja, ha PUT-al, akkor módosítani szeretnénk. A collection végpontjára pedig POST-ot küldve tudunk új elemet felvenni. Persze ezek az alapok és mi szabadon bővíthetjük ezt (csak dokumentáljuk le 🙂 )</div>

<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Lőjünk fel egy PostMan-t és küldjünk egy GET kérést a localhost:8888/todo végpontunkra. Ha jól csináltuk, akkor a válaszban ez lesz:</div>```
<pre class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" data-language="javascript"><span class="sBrace structure-1" id="s-1">{ <i class="fa fa-minus-square-o"></i> </span>
   <span class="sObjectK" id="s-2">"_links"</span><span class="sColon" id="s-3">:</span><span class="sBrace structure-2" id="s-4">{ <i class="fa fa-minus-square-o"></i> </span>
      <span class="sObjectK" id="s-5">"self"</span><span class="sColon" id="s-6">:</span><span class="sBrace structure-3" id="s-7">{ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sObjectK" id="s-8">"href"</span><span class="sColon" id="s-9">:</span><span class="sObjectV" id="s-10">"http://localhost:8888/todo"</span>
      <span class="sBrace structure-3" id="s-11">}</span>
   <span class="sBrace structure-2" id="s-12">}</span><span class="sComma" id="s-13">,</span>
   <span class="sObjectK" id="s-14">"_embedded"</span><span class="sColon" id="s-15">:</span><span class="sBrace structure-2" id="s-16">{ <i class="fa fa-minus-square-o"></i> </span>
      <span class="sObjectK" id="s-17">"todo"</span><span class="sColon" id="s-18">:</span><span class="sBracket structure-3" id="s-19">[ <i class="fa fa-minus-square-o"></i> </span>

      <span class="sBracket structure-3" id="s-20">]</span>
   <span class="sBrace structure-2" id="s-21">}</span><span class="sComma" id="s-22">,</span>
   <span class="sObjectK" id="s-23">"page_count"</span><span class="sColon" id="s-24">:</span><span class="sObjectV" id="s-25">0</span><span class="sComma" id="s-26">,</span>
   <span class="sObjectK" id="s-27">"page_size"</span><span class="sColon" id="s-28">:</span><span class="sObjectV" id="s-29">25</span><span class="sComma" id="s-30">,</span>
   <span class="sObjectK" id="s-31">"total_items"</span><span class="sColon" id="s-32">:</span><span class="sObjectV" id="s-33">0</span><span class="sComma" id="s-34">,</span>
   <span class="sObjectK" id="s-35">"page"</span><span class="sColon" id="s-36">:</span><span class="sObjectV" id="s-37">0</span>
<span class="sBrace structure-1" id="s-38">}</span>
```

<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Wow, ez úgy néz ki működik, látjuk a saját URL-t, látjuk ,hogy 25-ösével lapoz, 0 elem van egyelőre, 0 oldal és mi is azon vagyunk. Na de akkor hozzunk létre egy új elemet, elvileg azt is tudnunk kellene, nem? A REST elvek szerint ha ugyanerre az URL-re küldünk egy POST kérést, azzal tudunk létrehozni egy új elemet.</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Küldjünk egy POST kérést ugyanerre az URL-re, de a form data mezők közé vegyük fel a 'name' : 'debug that shit' és a 'done' : 0 kulcs-érték párt.</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div>> <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Ugyanezt küldhetjük JSON formátumban a form body-ban, ha a Content-type mező értékének beállítjuk az application/json-t.</div>

<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">Ennek kellene visszajönnie:</div>```
<pre class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" data-language="javascript"><span class="sBrace structure-1" id="s-1">{ <i class="fa fa-minus-square-o"></i> </span>
   <span class="sObjectK" id="s-2">"id"</span><span class="sColon" id="s-3">:</span><span class="sObjectV" id="s-4">"1"</span><span class="sComma" id="s-5">,</span>
   <span class="sObjectK" id="s-6">"name"</span><span class="sColon" id="s-7">:</span><span class="sObjectV" id="s-8">"debug that shit"</span><span class="sComma" id="s-9">,</span>
   <span class="sObjectK" id="s-10">"done"</span><span class="sColon" id="s-11">:</span><span class="sObjectV" id="s-12">0</span><span class="sComma" id="s-13">,</span>
   <span class="sObjectK" id="s-14">"_links"</span><span class="sColon" id="s-15">:</span><span class="sBrace structure-2" id="s-16">{ <i class="fa fa-minus-square-o"></i> </span>
      <span class="sObjectK" id="s-17">"self"</span><span class="sColon" id="s-18">:</span><span class="sBrace structure-3" id="s-19">{ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sObjectK" id="s-20">"href"</span><span class="sColon" id="s-21">:</span><span class="sObjectV" id="s-22">"http://localhost:8888/todo/1"</span>
      <span class="sBrace structure-3" id="s-23">}</span>
   <span class="sBrace structure-2" id="s-24">}</span>
<span class="sBrace structure-1" id="s-25">}</span>
```

Ha belelesünk az adatbázisba, akkor láthatjuk, hogy ott van az általunk megadott rekord, tehát beillesztettük az adatbázisba az elemet, valamint visszajött a hozzá tartozó ID, sőt az erre az elemre mutató link is, ha később szükségünk lenne rá. De ha már ideadta, nézzük meg, mit kapunk, ha arra a címre küldünk egy GET kérést? Igen, ugyanezt, mivel a válaszban megkapjuk a kész entitást, így megspórol nekünk a REST egy kérést. 🙂

Most ha küldünk egy GET kérést a /todo címre, akkor már merőben más fogad:

```
<span class="sBrace structure-1" id="s-1">{ <i class="fa fa-minus-square-o"></i> </span>
   <span class="sObjectK" id="s-2">"_links"</span><span class="sColon" id="s-3">:</span><span class="sBrace structure-2" id="s-4">{ <i class="fa fa-minus-square-o"></i> </span>
      <span class="sObjectK" id="s-5">"self"</span><span class="sColon" id="s-6">:</span><span class="sBrace structure-3" id="s-7">{ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sObjectK" id="s-8">"href"</span><span class="sColon" id="s-9">:</span><span class="sObjectV" id="s-10">"http://localhost:8888/todo?page=1"</span>
      <span class="sBrace structure-3" id="s-11">}</span><span class="sComma" id="s-12">,</span>
      <span class="sObjectK" id="s-13">"first"</span><span class="sColon" id="s-14">:</span><span class="sBrace structure-3" id="s-15">{ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sObjectK" id="s-16">"href"</span><span class="sColon" id="s-17">:</span><span class="sObjectV" id="s-18">"http://localhost:8888/todo"</span>
      <span class="sBrace structure-3" id="s-19">}</span><span class="sComma" id="s-20">,</span>
      <span class="sObjectK" id="s-21">"last"</span><span class="sColon" id="s-22">:</span><span class="sBrace structure-3" id="s-23">{ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sObjectK" id="s-24">"href"</span><span class="sColon" id="s-25">:</span><span class="sObjectV" id="s-26">"http://localhost:8888/todo?page=1"</span>
      <span class="sBrace structure-3" id="s-27">}</span>
   <span class="sBrace structure-2" id="s-28">}</span><span class="sComma" id="s-29">,</span>
   <span class="sObjectK" id="s-30">"_embedded"</span><span class="sColon" id="s-31">:</span><span class="sBrace structure-2" id="s-32">{ <i class="fa fa-minus-square-o"></i> </span>
      <span class="sObjectK" id="s-33">"todo"</span><span class="sColon" id="s-34">:</span><span class="sBracket structure-3" id="s-35">[ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sBrace structure-4" id="s-36">{ <i class="fa fa-minus-square-o"></i> </span>
            <span class="sObjectK" id="s-37">"id"</span><span class="sColon" id="s-38">:</span><span class="sObjectV" id="s-39">"1"</span><span class="sComma" id="s-40">,</span>
            <span class="sObjectK" id="s-41">"name"</span><span class="sColon" id="s-42">:</span><span class="sObjectV" id="s-43">"debug that shit"</span><span class="sComma" id="s-44">,</span>
            <span class="sObjectK" id="s-45">"done"</span><span class="sColon" id="s-46">:</span><span class="sObjectV" id="s-47">"0"</span><span class="sComma" id="s-48">,</span>
            <span class="sObjectK" id="s-49">"_links"</span><span class="sColon" id="s-50">:</span><span class="sBrace structure-5" id="s-51">{ <i class="fa fa-minus-square-o"></i> </span>
               <span class="sObjectK" id="s-52">"self"</span><span class="sColon" id="s-53">:</span><span class="sBrace structure-6" id="s-54">{ <i class="fa fa-minus-square-o"></i> </span>
                  <span class="sObjectK" id="s-55">"href"</span><span class="sColon" id="s-56">:</span><span class="sObjectV" id="s-57">"http://localhost:8888/todo/1"</span>
               <span class="sBrace structure-6" id="s-58">}</span>
            <span class="sBrace structure-5" id="s-59">}</span>
         <span class="sBrace structure-4" id="s-60">}</span>
      <span class="sBracket structure-3" id="s-61">]</span>
   <span class="sBrace structure-2" id="s-62">}</span><span class="sComma" id="s-63">,</span>
   <span class="sObjectK" id="s-64">"page_count"</span><span class="sColon" id="s-65">:</span><span class="sObjectV" id="s-66">1</span><span class="sComma" id="s-67">,</span>
   <span class="sObjectK" id="s-68">"page_size"</span><span class="sColon" id="s-69">:</span><span class="sObjectV" id="s-70">25</span><span class="sComma" id="s-71">,</span>
   <span class="sObjectK" id="s-72">"total_items"</span><span class="sColon" id="s-73">:</span><span class="sObjectV" id="s-74">1</span><span class="sComma" id="s-75">,</span>
   <span class="sObjectK" id="s-76">"page"</span><span class="sColon" id="s-77">:</span><span class="sObjectV" id="s-78">1</span>
<span class="sBrace structure-1" id="s-79">}</span>
```

Ez már azért egy fokkal hosszabb válasz. A \_links alatt találjuk a paginationre vonatkozó linkeket, az \_embedded alatt pedig a collectionben rejlő információt.

> Akadnak esetek, mikor komplex, nagy adathalmazok érkeznének, ilyenkor a collection tartalma nem érkezik meg így, csupán az egyes elemekre mutató linkek.

Na és mi a helyzet akkor, ha módosítani szeretnénk egy ilyen elemet? Azt szintén az adott entitásra mutató PUT kéréssel tudjuk elérni, mégpedig úgy, hogy küldjük a módosítandó mezőket, JSON formátumban.

Küldjünk hát egy PUT kérést, ezzel jelezve, hogy mi ezt az entitást szeretnénk módosítani:

```
PUT /todo/1 HTTP/1.1
Content-type : application/json

{
  "name" : "debug this shit",
  "done" : 1
}
```

Erre pedig a válasz:

```
<span class="sBrace structure-1" id="s-1">{ <i class="fa fa-minus-square-o"></i> </span>
   <span class="sObjectK" id="s-2">"id"</span><span class="sColon" id="s-3">:</span><span class="sObjectV" id="s-4">"1"</span><span class="sComma" id="s-5">,</span>
   <span class="sObjectK" id="s-6">"name"</span><span class="sColon" id="s-7">:</span><span class="sObjectV" id="s-8">"debug this shit"</span><span class="sComma" id="s-9">,</span>
   <span class="sObjectK" id="s-10">"done"</span><span class="sColon" id="s-11">:</span><span class="sObjectV" id="s-12">"1"</span><span class="sComma" id="s-13">,</span>
   <span class="sObjectK" id="s-14">"_links"</span><span class="sColon" id="s-15">:</span><span class="sBrace structure-2" id="s-16">{ <i class="fa fa-minus-square-o"></i> </span>
      <span class="sObjectK" id="s-17">"self"</span><span class="sColon" id="s-18">:</span><span class="sBrace structure-3" id="s-19">{ <i class="fa fa-minus-square-o"></i> </span>
         <span class="sObjectK" id="s-20">"href"</span><span class="sColon" id="s-21">:</span><span class="sObjectV" id="s-22">"http://localhost:8888/todo/1"</span>
      <span class="sBrace structure-3" id="s-23">}</span>
   <span class="sBrace structure-2" id="s-24">}</span>
<span class="sBrace structure-1" id="s-25">}</span>
```

Itt is megkapjuk tehát az entitás módosítás utáni állapotát.

Az entitás törléséhez pedig egy DELETE kérést kell indítanunk erre a címre és volt-nincs todo.

Láthatjuk hát, hogy a legtöbb linket a rendelkezésünkre bocsátja a rendszer, így a kliensnek csak az elvégzendő művelethez tartozó HTTP verb-el kell tisztában lennie, a szükséges linkeket megkapja a rendszerből. Ennélfogva ha nem égetjük azokat bele, hanem mindig a válasz alapján dolgozunk, akkor a szerveren szabadon módosíthatjuk az egyes resource-okon belüli elérési utakat, mert nem borítja meg a klienseket.

Na de jöjjön egy kis dokumentáció, majd nézzük hogy is lehet ezt deployolni!

Ha a Service-ünkre kattintunk, akkor láthatjuk a hozzá tartozó menüket:[![Selection_002](assets/uploads/2016/08/Selection_002.png)](assets/uploads/2016/08/Selection_002.png)

A **General Settings** alatt tudjuk testreszabni a hozzá tartozó route-ot, hogy mely HTTP metódusokat engedlyük a klienseknek, mi lesz a hydrator típusa, mi lesz a collection neve (amit a fenti válaszban láttunk az \_embedded mező alatt), az Entity és Collection objektumaink osztályait is lehet megadni, a pagination kezeléséhez szükséges paramétert, a táblában lévő primary key-t.[![Selection_007](assets/uploads/2016/08/Selection_007-1024x349.png)](assets/uploads/2016/08/Selection_007.png)

A **Database settings** alatt tudjuk a service-t egy másik táblára vagy éppen adatbázisra átállítani.[![Selection_008](assets/uploads/2016/08/Selection_008.png)](assets/uploads/2016/08/Selection_008.png)

A **Content Negitiation** alatt lehet beállítani, hogy milyen kérésekre, milyen válaszokkal tudunk válaszolni (Accept) , és milyen Content-type-ot fogadunk el.[![Selection_009](assets/uploads/2016/08/Selection_009.png)](assets/uploads/2016/08/Selection_009.png)

A **Fields** tab alatt az entity-hez tartozó mezőket láthatjuk, és újakat is hozzáadhatunk akár, ha nem DB connected alapján vettük fel azt, vagy megváltozott időközben a séma. Különböző validátorokat rendelhetünk hozzájuk. Filtereket, amikkel pl. trimmelhetjük a stringeket, castolhatjuk a változókat, stb.[![Selection_011](assets/uploads/2016/08/Selection_011-1024x162.png)](assets/uploads/2016/08/Selection_011.png)

De nézzük meg mit is tudunk szerkeszteni a mezőkön, ugyanis itt lesz majd a dokumentációnak egy kis része:

[![Selection_010](assets/uploads/2016/08/Selection_010.png)](assets/uploads/2016/08/Selection_010.png)

Itt kell beállítani az egyes mezőkhöz tartozó leírást, a típusát is megadhatjuk, valamint ha ezen validáció során valami hiba történik, akkor a hibaüzenet is testreszabható.

Az **Authorization** tab alatt lehet a resource-ra vonatkozóan authorizációhoz kötni a kéréseket. Jelenleg ez üres, mert nem használunk semmiféle authentikációt sem, így most hagyjuk így.[![Selection_012](assets/uploads/2016/08/Selection_012.png)](assets/uploads/2016/08/Selection_012.png)

Na és itt jön a lényeg, a **Documentation** tab, ami alatt generált dokumentációt tudjuk létrehozni. Megadhatjuk a REST service leírását, a collection leírását, hogy az egyes metódusokkal pontosan mit is érhetünk el, milyen választ fogunk kapni és milyen payloadot várnak. A konfiguráció alapján ki tud nekünk generálni a rendszer a szükséges helyeken egy példa választ és kérést is, amit akár példa adatokkal fel is tölthetünk.[![Selection_013](assets/uploads/2016/08/Selection_013.png)](assets/uploads/2016/08/Selection_013.png)

Ha kitöltöttük őket, akkor már csak a **Source code** fül marad, ami jelenleg két elemből áll, a **Collection** és az **Entity** classból. Gyakorlatilag ezeket "piszkálhatjuk", habár nem a rendszeren keresztül, mert itt szerkeszteni nem lehet azokat.

Na és most nézzük meg a generált dokumentációt a navbarban található Documentation menü alatt![![Selection_014](assets/uploads/2016/08/Selection_014.png)](assets/uploads/2016/08/Selection_014.png)

Láthatjuk hogy jelenleg csak egy API van, a TodoBackend, az is a v1-es verzióval, ami linkre kattintva láthatjuk a részleteket is:[![Selection_015](assets/uploads/2016/08/Selection_015.png)](assets/uploads/2016/08/Selection_015.png)

Felsorolva az összes HTTP verb, amit elfogadunk és azokra kattintva lenyílnak az imént kreált dokumentációk is:

[![Selection_016](assets/uploads/2016/08/Selection_016-1024x605.png)](assets/uploads/2016/08/Selection_016.png)

Láthatjuk, hogy le van írva milyen válasz fejlécekkel, status kódokkal térhetünk vissza, mit reprezentálnak az egyes mezők, amiket visszakapunk, no meg mire is jó ez a resource?[![Selection_017](assets/uploads/2016/08/Selection_017-1024x387.png)](assets/uploads/2016/08/Selection_017.png)

Most, hogy készítettünk egy minimál dokumentációt az API-hoz, nézzük hogy is tudjuk ezt kirakni a helyére!

> A dokumentációt alapesetben az apigility/documentation címen érjük majd el a deployolt packageben.

Jöjjön a Package fül a navbaron![![Selection_018](assets/uploads/2016/08/Selection_018-1024x315.png)](assets/uploads/2016/08/Selection_018.png)

A package krelálása elég egyértelmű a fentiek alapján, kiválasztjuk a formátumát (a ZIP a legtöbb telepítéssel működik), hogy melyik API-kat szeretnénk benne, futtassa-e a composert (ezzel lehetnek problémák), valamint rákérdez, hogy milyen config fájlokat mellékeljük. Egyelőre hagyjuk ZIP-en, válasszuk ki a TodoBackendet és nyomjuk egy generate-re. Ez a komplett applikációt, vendor mappa nélkül betömöríti egy ZIP-be, utána letölti azt. Ezt tömörítsük ki a helyére, állítsunk rá egy vhost-ot, de előtte a gyökerében hajtsunk végre egy

```
$ composer install
```

parancsot. Ha rákérdez a Zend/Validatorra, akkor a module configba injektáljuk azt.

Ha most ránézünk, akkor a főoldalon már nem irányít át az admin UI-ra, hanem egy figyelmeztető oldal jön be, miszerint jelenleg production módban van az alkalmazás és ha szeretnénk folytatni a fejlesztést, akkor ahhoz bizony a composer kell.[![Selection_019](assets/uploads/2016/08/Selection_019-1024x450.png)](assets/uploads/2016/08/Selection_019.png)

Viszont ha itt meghívjuk a korábban tesztelt URI-t, akkor biza autentikusan csecsre fut. Hát persze, mert a konfigurációs fájlokat nem mellékeltük, honnan tudná a rendszer, hogy melyik adatbázishoz csatlakozzon? Hozzunk létre egy local.php-t a config/autoload mappán belül és töltsük fel!

```
<?php
return [
    'db' => [
        'adapters' => [
            'Local MySQL' => [
                'charset' => 'utf8',
                'database' => 'todo',
                'driver' => 'PDO_Mysql',
                'hostname' => 'boszme_mysql_host',
                'username' => 'todo',
                'password' => 'password',
                'port' => '3306',
            ]
        ],
    ],
];
```

Természetesen írjuk át a megfelelő elérésre és felhasználónév/jelszó kombóra. Ha ezt megtettük, akkor elméleti síkon működnie kell, viszont még mindig van egy kis apróság, ami [gondot](https://github.com/zfcampus/zf-apigility/issues/176) okozhat (legalábbis engem beszívatott Ubuntu alatt). Ezért, a config/application.config.php-ben a

```
'config_glob_paths' => 
array (
0 => '/tmp/ZFDeploy_57c06a6d3c68a/config/autoload/{,*.}{global,local}.php',
),
```

írjuk át:

```
'config_glob_paths' => [realpath(__DIR__) . '/autoload/{,*.}{global,local}.php'],
```

Ha ezzel is megvagyunk és a config is jó, akkor minden fasz és működik a cucc!

Legközelebb belőjük az authentikációt, összelőjük az Ionicos projekttel és kicsit tovább bővítjük a dolgot!
