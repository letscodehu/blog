---
id: 458
title: 'Git 3 &#8211; Under the hood'
date: '2015-03-27T21:05:04+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=458'
permalink: /2015/03/27/git-3-under-the-hood/
dsq_thread_id:
    - '3632518865'
    - '3632518865'
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
categories:
    - Intermediate
tags:
    - git
    - hooks
    - merge
---

> Szedd össze, amid van...

Aki ismeri a fenti 30Y számot, annak se lesz világos, hogy miről lesz most szó, úgyhogy ne is foglalkozzunk vele, hanem rántsuk le a leplet a hőn áhított git merge-ről! Az[ előző részben ]({{ site.url }}/2015/03/23/gittegylet-2-a-karosszerialakatos-visszavag/ "Gittegylet 2 – A karosszérialakatos visszavág") szó esett arról, hogy is lehet a különböző branch-eket létrehozni, azok logikai működése, viszont hiába emlegettük azt a bizonyos merge szócskát, arra nem derült fény, hogy ez mi is lehet?

##### Git merge![](assets/uploads/2015/03/trabant.jpg)

Tegyük fel, hogy jófiúk lévén egy development branch-ből leágazva fejlesztünk egy ún. feature branch-et. Ahhoz, hogy ezt a feature-t logikailag beleépítsük a kódbázisunkba az szükséges, hogy eljuttassuk a production(jelen esetben master) ágra. Ezt több módon tudjuk megtenni. Az egyik ilyen módszer az, hogy <del>gyere velem kislány meggyet szedni</del> a cherry pick. Ez arról szól, hogy egy adott branch-re csak az "érett" patch-eket húzzuk be. Ezt majd részletesen is kitárgyalom, most jöjjön a másik módszer, a merge. A merge arra hivatott, hogy két (local/remote) branch-et egyesítsen. Ez az egyesítés a commit-ok összefűzését jelenti.

#### Fast forward

Akkor most vizualizáljunk egy kicsit. Ugye idézzük fel az előző cikkben említett struktúrát (na jó, belinkeltem lentebb).![refs_visual](assets/uploads/2015/03/refs_visual.jpg)A development branch direkt leszármazottja a masternek, vagyis a master ágon létrehoztunk egy új branchet és oda commitoltunk tovább, ezért a master head referenciája a development ág első commitja előtti commitra mutat. Mivel a dev head egyenes ági leszármazottja a master headnek, ezért conflict nem lehetséges (lévén nem ágazott el a két branch), így ha jelen állapotban beírjuk a következőt:

```
git merge development
```

Akkor git felgyorsítja a dolgot és az ún. fast forward módszert használja az egyesítésre. Ez annyit tesz, hogy a master head referenciáját átállítja a dev head referenciájára. Ezután mind a development, mind a master head ugyanazon commit-ra mutat majd.

##### <del>World in</del> Conflict

Viszont tegyük fel, hogy már jócskán a development ágba merültünk (#7), mikor a masteren egy hotfix-et akarunk applikálni. Ehhez vissza kell térjünk a master ágra. Tehát

```
git checkout master
```

paranccsal a working directory immáron a master ág utolsó commit-ja (#2) idei állapotot fogja tükrözni. Itt létrehozunk egy ún. hotfix branchet és tolunk bele 1-2 commit-ot (#8 és #9). Ezt könnyűszerrel össze tudjuk fűzni a masterrel, mivel ahogy már az imént meséltem fast-forward-al, csak a master head-et fogja átllítani a hotfix head-re (#9). A kód kész, mehet is ki élesbe, mi pedig folytatjuk a munkát újra a development ágon (#10). Elkészülünk az adott fejlesztéssel és szeretnénk bemergelni a master ágba.

Viszont most nem olyan egyszerű a dolog, lévén két külön ágról beszélünk, ezért a fast forward [![merging](assets/uploads/2015/03/merging1.jpg)](assets/uploads/2015/03/merging1.jpg)módszer itt nem jön szóba. Ha commit-ok nem érintik ugyanazt a fájlt, akkor megkímélhetjük magunkat egy jól szituált conflict-tól, ha igen, akkor még mindig bízhatunk abban, hogy a git alapból elég okos és megpróbálja magától összefűzni azt a fájlt, többnyire sikerrel (többféle összefűzési stratégia létezik). Ha mégsem, akkor kerül a fájl ún. conflicted state-be. A fenti esetben egy úgynevezett three-way-merge-re kerül sor, ami során a git veszi a két branch-et amit szeretnénk összefűzni (9# és 10#), valamint a legutolsó közös pontot (#2) és egy új ún. merge commit-ot hoz létre (#11).

Vegyünk egy pofonegyszerű conflict esetet: A #2-es számú commitban az index.html fájl eleje így nézett ki:

```
1 <html>
2 <head><title>Teszt</title>
3 </head>
```

Ez lesz a közös őse a két fájlnak. Jöjjön a hotfix masterbe mergelt (#9) verziója:

```
1 <html>
2 <head><title>Teszt
3 </title></head>
```

Aztán a dev (#10) verziója:

```
1 <html>
2 <head>
3 <title>Teszt</title></head>
```

Amikor ebbe az ún. conflicted state-be kerül a fájl, akkor a git automatikusan jelöli, hogy hol is van a baj a fájlban, így az index.html a merge után így fog kinézni:

```
1 <html> // ez a rész ami egyezik
2 <<<<<<< HEAD // itt kezdődik az aktuális branchből való, AMIBE mergelünk
3 <head><title>Teszt
4 </title></head>
5 ======= // itt jön az a branch, AMIBŐL mergelünk
6 <head>
7 <title>Teszt</title></head>
8 >>>>>>> dev // itt ér véget az ütközés
```

Az ütköző fájlokat ezért szerkeszteni kell, el kell dönteni mi marad és mit törlünk és utána be lehet commitolni a változást. Ha nem egy vim-ben akarjuk bepötyögni a változásokat, akkor a git mergetool parancs segíthet, ahol előre konfigurált merge-re fejlesztett gui eszközökkel tudjuk megkönnyíteni a dolgunkat, de az IDE pluginek is sokat segíthetnek.

##### Hooks

[![scorpion](assets/uploads/2015/03/scorpion.jpg)](assets/uploads/2015/03/scorpion.jpg)

Aki foglalkozott már <span style="text-decoration: line-through;">ördögűzéssel</span> népszerű tartalomkezelőkkel, annak bizonyára ismerős a hook szócska és jobb esetben (ha nem csak templateket és plugineket rakott fel <span style="text-decoration: line-through;">és webfejlesztőnek titulálta magát</span>) tudja is mit értünk ez alatt. Hook alatt egy adott folyamat/workflow/lifecycle adott pontjához rögzített akciót értünk, magyarán valamit hozzádrótozunk egy folyamat egy pontjához. Vegyük pl. a webhook-okat. Legyen az pl. a slack nevű program Jira integrációja. A jira-ban levő ticketek módosítása egy lekérést eredményez a slack API-ra, ezzel bedobva pl. az adott ticketet egy channelre.  
A git is fel van vértezve ilyen hook-okkal, amik a commit/push folyamatának bizonyos pontjaiban futhatnak le.  
Ezek a hook-ok egyszerű bash scriptek, amik a hooks mappában várják a megváltást. Két nagy csoportra bonthatjuk őket: kliensoldali és szerveroldali. A kliensoldali hook-ok a commitolás folyamatához kötődnek és a local repository-ban van jelentőségük. Commit messagenek lehet a formátumát megkötni, validálásokat lefuttatni, emailt küldeni a commitról, stb.  
A szerveroldali hookok a push-hoz és a pull-hoz kapcsolódnak, jellemzően kicheckoutolja a dolgot, esetleg előtte teszteket futtathat le, ha sikeres, bemergelheti egy másik ágba és így tovább.

> Fontos: A hooks könyvtárban található fájlok alapértelmezetten nem futtathatóak, így a használatukhoz mindenképp be kell ezt állítani.

Az egyes hook-ok részletes kitárgyalása csak a következő cikkben lesz esedékes, így ha érdekel, mindenképp látogass vissza hozzánk!