---
id: 1171
title: 'ISP &#8211; Interface segregation principle'
date: '2016-07-09T22:24:52+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1171'
permalink: /2016/07/09/isp-interface-segregation-principle/
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
image: 'assets/uploads/2016/07/09202137/refactoring-to-solid-code-32-728.jpg'
categories:
    - 'Design Pattern'
tags:
    - design
    - interface
    - isp
    - pattern
    - php
    - principle
    - segregation
    - solid
---

Amikor új applikáció tervezésébe kezdünk, akkor nem árt komolyan fontolóra venni, hogy milyen absztrakciókat is fogunk használni az egyes modulok és submodulok esetén. Ha ezen modulok egyike esetünkben egy osztály, akkor az absztrakció formája nem lesz más, mint egy interface. Tegyük fel, hogy ezt létrehoztuk és az adott osztályt implementáltuk is, minden klappol, megkaptuk érte a kis pénzünket és nem utolsó sorban úgy működik, ahogy <del>a megrendelő elképzelte</del> elképzeltük.  
[![refactoring-to-solid-code-32-728](assets/uploads/2016/07/refactoring-to-solid-code-32-728.jpg)](assets/uploads/2016/07/refactoring-to-solid-code-32-728.jpg)

Akkor most jön az, hogy a kedves megrendelő szeretné, ha az adott modul működne.. egy kicsit másképp, hogy valamivel pontosabbak legyünk, egy lightweight verzió kellene neki egy másik mikroframework-be, ahol nem szükséges rommákonfigurálhatóvá tenni a működést.

Mi sem egyszerűbb? Egy kis <del>copy paste és bumm</del> cicomázás és máris kész. Azt már tudjuk, hogy mivel ez egy egyszerűbb verzió lesz, ezért az öröklődés nem jöhet szóba (mert akkor valószínűleg megsértenénk az [LSP]({{ site.url }}/2016/07/05/betonozas-3-0-liskov-es-haverok/)-t, viszont azt az interfészt használhatnánk, nemde? Mindig mindenki azt mondta, hogy az interfészek használata jó dolog. Az is. Lévén az adott osztály működéséhez szükséges összes publikus metódust felvettük abba a bizonyos interfészbe, ezért itt meg is kell azokat valósítani. De a gond ott kezdődik, hogy a metódusok felét itt nem tudjuk értelmezni, hiszen ez volt a kérés, hogy egy lebutított verzió kell.

> Mit tegyünk ilyenkor?

Tegye fel a kezét az, aki szerint a helyes megoldás az lenne, ha üres method body-val vagy egy NotImplementedException-el oldjuk meg a dolgot? Utána pedig üljön le és gondolkozzon el az élet értelmén, mert ez nem a jó megoldás.

Amikor így teleszemeteljük az interfészt, azt fat, vagy polluted inteface-ként szokás emlegetni. A fenti megoldás jó esetben váratlan exceptionöket, rosszabb esetben pedig hosszú napokkal eltöltött álmatlan debuggolást eredményez és szerintem senki se kíván magának hasonlót. Akkor jöjjön újra a kérdés:

> Mit tegyünk ilyenkor?

Ahogy az OO nagyatyai mondanák, **szétcsapassuk'**! Legalábbis kocsmanyelven így hangzana, ellenben a szakma tolvajnyelvén kicsit hosszabban:

> Az ISP elv szerint a klienseknek ne kelljen implementálni olyan interfészeket, amiket nem használnak (ki). Az ilyen nagy interfészek helyett használjanak inkább apró interfészeket, metódusaik csoportosítva, mindegyik egy-egy alrendszert szolgálva.

Na de mit is jelent ez a gyakorlatban? Nézzünk rá valami példát, ami által remélhetőleg megmarad majd valami.

```
<pre data-language="php">interface Controller {
 
 public function setServiceLocator(ServiceManager $manager);
 public function getServiceLocator();
 public function onApplicationContextLoaded(Event $event);
 public function onRequestDispatched(Event $event);
 public function getRouter();
 public function setRouter(Router $router);
 public function setPluginManager(PluginManager $manager);
 public function getPluginManager();
 public function __call($method, $parameters);
}

abstract class AbstractController implements Controller {
    // tök jó, ha abstract akkor meg se kell valósítanunk azt, how cool is that?
}

class HomeController extends AbstractController {
  // itt viszont már meg kell valósítanunk mindent ami az interfészben ki van kötve
}
```

A fentiekben deklaráltunk egy jó nagy böszme interfészt, amin a kontrollerünkben szükséges metódusok vannak felsorolva. A servicelocator beinjektálására és kikérésére, két eseményre is feliratkozhatunk elviekben, a routert is be lehet állítani, majd kikérni, valamint van itt egy pluginmanager is, ami lévén a nem létező metódusokat a \_\_call segítségével át tudjuk passzolni egy pluginnek. Fasza, mi? <del>Ilyet ha lehet ne használjunk, mert az életbe nem tudjuk majd kibogarászni a runtime ráaggatott "plugin" metódusokat, kész agyrém...</del> Tegyük fel, hogy mindezt meg is valósítjuk az abstract controllerünkben, utána már csak le kell azt örökíteni és minden megy magától. Viszont mi van akkor, ha én akarok valahova egy ilyen pluginmanageres mókát<del>, mert igazán szeretek szívni</del>? Legyen ez valami repository, amire akarok "akasztani" egy loggert ilyen módon. Induljunk el a legszörnyűbb úttól a legjobb felé.

```
<pre data-language="php">interface Repository extends Controller { // a fenti controller interfészt kibővítjük
 public function save(Model $model);
 public function find($id);
 public function findAll();
 public function update(Model $model);
}

class RucsokRepository implements Repository {
  // megvalósíthatjuk az egészet...
}
```

Na ez az a megoldás, amiért kevesebbért is [perl script általi halálra](https://www.quora.com/Homework-Question-How-do-I-write-a-program-that-produces-the-following-output-1) ítélnek egyeseket. Kibővítjük az iménti böszme interfészt még több metódussal, amiket kivételesen még használunk is, hogy utána a megvalósítandó osztályban már csak egy hatalmas interfészt kelljen implementálni. **No sir, no.**

A következő kevésbé csúnya megoldás, ha egy fokkal jobban szétnyessük őket:

```
<pre data-language="php">interface Repository {
 public function save(Model $model);
 public function find($id);
 public function findAll();
 public function update(Model $model);
}

class RucsokRepository implements Repository, Controller {
  
}
```

Na itt már nem bővítettük ki az eredeti interfészt, hanem két interfészt implementálunk, viszont ez megint 13 metódus összesen, amiből mi 7-et akarunk használni mindösszesen. Akkor jöjjön az, hogy szétbontjuk az eredeti interfészt, mégpedig az összetartozó metódusok alapján:

```
<pre data-language="php">interface Pluginable {
 public function setPluginManager(PluginManager $manager);
 public function getPluginManager();
 public function __call($method, $parameters);
}

interface ServiceLocatorAware {
 public function setServiceLocator(ServiceManager $manager);
 public function getServiceLocator();
}

interface ApplicationEventListener {
 public function onApplicationContextLoaded(Event $event);
 public function onRequestDispatched(Event $event);
}

interface RouterAware {
 public function getRouter();
 public function setRouter(Router $router);
}
```

Akkor nézzük mi is történt az imént. Csináltunk egy Pluginable interfészt, amivel a pluginmanagert beállíthatjuk, kikérhetjük és a \_\_call megvalósítását megköveteljük. Aztán jön még a ServiceLocatorAware, amivel a servicelocatort tudjuk beállítani és kikérni. Az ApplicationEventListener, amivel feliratkozhatunk eseményekre, valamint a RouterAware, amin át a Routert tudjuk beinjektálni és kikérni. Ezután az iménti AbstractController így néz ki:

```
<pre data-language="php">abstract class AbstractController implements Pluginable, 
 ServiceLocatorAware, 
 RouterAware, 
 ApplicationEventListener {
 
}

class RucsokRepository implements Repository, Pluginable {
  // csak 7 metódust kell megvalósítani, semmi sallang meg NotImplementedException
}
```

Igen, több interfész is meg van valósítva, de mostmár a fentieket tudjuk darabolni. Ha valahol akarunk eseményekre feliratkozni, nem kell berántanunk egy hatalmas interfészt, aztán telerakni üres metódusokkal, hogy a fordító ne szóljon be.

> Pedig ez utóbbi elég gyakori eset.

Vegyük Pistikét. Pistike leszarja az iménti szentbeszédet és az első megoldás szerint jár el. Tegyük fel, hogy a kedves olvasó valamilyen szörnyű balszerencse lévén együtt kell dolgozzék alulírott Pistikével. Találkozik hát az alábbi kódrészlettel:

```
<pre data-language="php">/** @var Repository $repository */
private $repository;
```

Ezek utána a kedves IDE bizony felajánl bruttó 13 metódust. Nyomogatjuk a nyilat lefele és szemünk elé tárul az a bizonyos getServiceLocator, hogy itt biza elérjük az alkalmazás IoC containerét! Tegyük fel, hogy olyan kontextusban vagyunk, ahol nem elérhető a konténer, de tudjuk, hogy van benne egy Logger, amin keresztül szeretnénk kilogolni valamit<del>, csak Demeter meg ne lássa</del>.

```
// valamiféle kontext
$this->repository->getServiceLocator()->get("Logger")->info("OO is dead!");
```

Na amint ezt a rondaságot lefuttatjuk (később lesz szó Demeter törvényéről, aminek a fenti kód nagyon nem felel meg), akkor bizony csúnyán csecsre fut a dolog, mivel azt mondja majd a hibaüzenet, hogy bizony mi null értéken hívtunk metódust. Mi a fene? Hát ennek egy ServiceLocatort kellene visszaadnia. Áhh, bizonyára nem lett megfelelően inicializálva. Nyomunk egy Go to Definition-t az IDE-ben és instant bontunk egy sört a nagy izgalomra, ugyanis ott ez áll:

```
public function getServiceLocator() {
   // @TODO Automatically generated method stub
}
```

Aztán végiggörgetünk az osztályon és találunk másik 5 ilyen metódust, amiknek a megvalósítása egy kommentben merül ki. Ez az a pont, ahol a legtöbben a tettlegességig jutnak és programozok közt a második leggyakoribb halálok a perl után.

Remélem mindenki megértette miért is ajánlott szétdarabolni az interfészeket és csak azokat implementálni, amiket tényleg meg is valósítunk 🙂[![874c939233c387ca1a1aa84b727178c7585f1a8afbf385ed8484428695fa95ba](assets/uploads/2016/07/874c939233c387ca1a1aa84b727178c7585f1a8afbf385ed8484428695fa95ba.jpg)](assets/uploads/2016/07/874c939233c387ca1a1aa84b727178c7585f1a8afbf385ed8484428695fa95ba.jpg)