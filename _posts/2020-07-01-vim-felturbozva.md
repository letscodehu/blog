---
id: 2317
title: 'Vim felturbózva'
date: '2020-07-01T14:18:22+02:00'
author: tacsiazuma
layout: post
guid: '/?p=2317'
permalink: /2020/07/01/vim-felturbozva/
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:12:{s:53:"//www.letscode.huassets/uploads/2020/06/coca.png";a:2:{s:2:"id";i:2341;s:11:"source_type";s:13:"media-library";}s:76:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/06/30005815/coca.png";a:2:{s:2:"id";i:2341;s:11:"source_type";s:13:"media-library";}s:82:"//www.letscode.huassets/uploads/2020/06/Screenshot-2020-07-01-at-14.05.39.png";a:2:{s:2:"id";i:2343;s:11:"source_type";s:13:"media-library";}s:105:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/06/01140604/Screenshot-2020-07-01-at-14.05.39.png";a:2:{s:2:"id";i:2343;s:11:"source_type";s:13:"media-library";}s:85:"//www.letscode.huassets/uploads/2020/06/Image-from-iOS-scaled-e1593119916758.jpg";a:2:{s:2:"id";s:4:"2330";s:11:"source_type";s:13:"media-library";}s:94:"//www.letscode.huassets/uploads/2020/06/Image-from-iOS-scaled-e1593119916758-1024x768.jpg";a:2:{s:2:"id";s:4:"2330";s:11:"source_type";s:13:"media-library";}s:108:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/06/25231621/Image-from-iOS-scaled-e1593119916758.jpg";a:2:{s:2:"id";s:4:"2330";s:11:"source_type";s:13:"media-library";}s:117:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/06/25231621/Image-from-iOS-scaled-e1593119916758-1024x768.jpg";a:2:{s:2:"id";s:4:"2330";s:11:"source_type";s:13:"media-library";}s:65:"//www.letscode.huassets/uploads/2020/06/2020-06-25_23-32.png";a:2:{s:2:"id";s:4:"2331";s:11:"source_type";s:13:"media-library";}s:74:"//www.letscode.huassets/uploads/2020/06/2020-06-25_23-32-1024x563.png";a:2:{s:2:"id";s:4:"2331";s:11:"source_type";s:13:"media-library";}s:88:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/06/25233222/2020-06-25_23-32.png";a:2:{s:2:"id";s:4:"2331";s:11:"source_type";s:13:"media-library";}s:97:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/06/25233222/2020-06-25_23-32-1024x563.png";a:2:{s:2:"id";s:4:"2331";s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2020/06/25233222/2020-06-25_23-32.png'
categories:
    - Egyéb
    - 'Kocka élet'
tags:
    - atreus
    - editor
    - vim
---

A legutóbb volt egy bejegyzésem, ami arról szólt, hogy váltani készülök a menő IDE-k felől a Vim felé. Akkor még csak két hete játszadoztam vele, így túl sokat nem tudtam még nyilatkozni róla. Azóta eltelt ismét egy kevés idő, így idejét éreztem, hogy újra bejelentkezzek a témával.

A szomorú helyzet az, hogy habár önmagának a vimnek is elég meredek a tanulási görbéje, én elkövettem azt a hibát, hogy mellétettem még pár dolgot. Az egyik ilyen, ami szerintem a leginkább megnehezíti a dolgot, az egy új billentyűzet. Persze most mindenki ráncolja a szemöldökét, hogy mégis mit számít a billentyűzet? Hát a helyzet az, hogy ez nem egy hétköznapi váltás, ugyanis ez egy 40%-os mechanikus billentyűzet, oszlopos elrendezéssel, mégpedig az Atreus.

<figure class="wp-caption aligncenter" style="width: 1024px">![](assets/uploads/2020/06/25231621/Image-from-iOS-scaled-e1593119916758-1024x768.jpg)<figcaption class="wp-caption-text">Az Atreus, bambusz házzal, Cherry MX brown kapcsolókkal és sima fekete billentyűkkel</figcaption></figure>

Ami azt jelenti, hogy kb feleakkora, mint egy sima billentyűzet, csak 42 gomb van rajta. Ez angol szöveghez bőven elég, de ha az ember ékezetes karaktereket akar, akkor bizony idő mire megtalálja azokat. Ezt úgynevezett rétegekkel oldják meg, amik közt tud az ember lépegetni. Így lehet elérni a nyilakat, a legtöbb ékezetes karaktert, a funkcióbillentyűket, vagy amit épp akarok, ugyanis a billentyűzet szabadon testreszabható a [QMK configuratorral](https://config.qmk.fm/#/atreus/teensy2/LAYOUT "QMK configuratorral").

Ez talán a legnagyobb hátráltató tényező volt a vim progressben, ugyanis kb két hét után találtam meg a 'ó'-t, fene se gondolta volna, hogy a Fn+Enter mögött lesz. A billentyűk felirat nélküliek, hogy tovább fokozzuk a hard mode-ot. Az elején okoz ez igazából hátrányt, hiszen a cél a vakon gépelés, a feliratok igazából nem kellenek. Ez a gépelés elég döcögősen indult, az elején nagymamásan másodpercenként kb. 1 karakterrel, de mára a keybr-en olyan 60-65 szó per percet csikarok ki magamból vele, ami nem olyan rossz, bár van még hova fejlődni, mert 70-75 volt a régebbi billentyűzeten. Ez közel egy hónap használat után. Az elején még csak részben használtam, de mára már csak ezen gépelek, mert ahogy fejlődtem, egyre jobban élveztem is a dolgot.

Igen, mert van egyfajta feelingje a dolognak, amit a mechanikus billentyűzet tovább fokoz. Itt a többféle kapcsoló közül egy Cherry MX Brown mellett döntöttem, mert habár a kéket akartam, az annyira hangos lenne, hogy kiüldöznek az irodából, ha újra visszamehetünk. Bizony, vinném magammal, ugyanis hihetetlenül könnyű és pont emiatt könnyen szállítható.

Na de ez még nem elég hard mode, ezért elkezdtem használni a tmuxot is, ami egy terminál multiplexer, azaz egy terminálban tudok több programot futtatni, azok közt lépegetni, természetesen a billentyűzettel. Itt is volt pár billentyűkombináció, amit meg kellett szokni, na meg a vim escape gombjával öszzeakadt egy kicsit a konfig, de persze mint a legtöbb parancssori szoftvert, ezt is szét lehet konfigurálni, így ez a probléma megoldódott.

Na de még ez se volt elég, így még ennek tetejébe elkezdtem ismerkedni az i3-al, de azt most egyelőre pihenőpályára tettem, mert már tényleg sok lett volna még egy új window managerrel is szívni. Ráadásul Mac-re nem találtam jó alternativát és szeretném, ha a két rendszer - amit napi szinten váltogatok -, közel hasonlóan menne.

Erre használom például a [dotfiles](https://pypi.org/project/dotfiles/ "dotfiles") python programot, amivel egy repositoryból linkelgetem a különböző konfigokat és githubra töltöm, a másik gépen pedig ugyanez vissza. A jelen állapot [itt](https://github.com/Tacsiazuma/vimrc) található.

Na de térjünk vissza a vimhez. Hogy állok? Lehet már fejlesztésre használni? Hozza már azt, amit bármelyik IDE? Jelenleg az alábbi módon néz ki:

<figure class="wp-caption aligncenter" style="width: 1024px">![](assets/uploads/2020/06/25233222/2020-06-25_23-32-1024x563.png)<figcaption class="wp-caption-text">Ez már egész IDE-szerű, nem?</figcaption></figure>

Amit itt látunk a fő ablakban, az egy java packageből kiszedett forráskód, amihez a goto definition segítségével ugrottam. Alul a zöld csík most nem sokat mutat, de igazából ez tmux-on belül fut, igaz egyedüli programként.

A caps lock mappingra már nincs szükségem, lévén az új billentyűzeten nincs is, de az esc lekerült a bal alsó sarokba, így egész kényelmesen elérhető.

A vim-es billentyűkombinációk már végképp megfertőztek, így pl IntelliJ-ben is csak a vim pluginnel tudok bármit is kezdeni és máshol is a hjkl-el akarok navigálni ösztönszerűen.

Az autoformat kikerült a pluginek közül, mert rájöttem, hogy a coc.nvim is megoldja mindezt.

A refaktorálások közül jópárat támogat a language server, de pár dolgot nem ajánl fel a saját kis menüjéből. Sajnos erre még nem találtam jó megoldást, a factorus nevű plugint próbáltam, de nem akart működni.

A debugging is kimaradt a korábbi körből, arra is találtam egy [plugint](https://github.com/idanarye/vim-vebugger), amit sajnos nem sikerült működésre bírnom. Csatlakozni csatlakozik a jvm-hez, de a többi nemigen megy, bár sokat nem foglalkoztam még vele, mondjuk ez leginkább a teszteknek köszönhető. Más nyelvekhez pedig nem is próbáltam, de ahogy mondtam, nem vagyok az a debuggolós fajta.

A scaffolding egy részét megoldottam egy saját kis [pluginnel](https://github.com/Tacsiazuma/easyjava.vim), ami kitölti a java fájlok tartalmát, meg a pom.xml-eket is.

A :-t felcseréltem normál módban a .-ra, így shift nélkül is át tudok menni command módba. A leader karaktert pedig space-re állítottam.

Ha már a space a leader karakter (amit felfoghatunk egyfajta Vim-en belüli Super keynek), akkor erre jött az ablakok közti navigáció mappingje. Így space+h,j,k,l segítségével tudok köztük lépegetni, meg egy csomó más. Pl a space+f formázza a fájlt, a space+a felhozza a kontext menüt, amit az adott helyen a fájlban végre tudok hajtani, pl átnevezések, automatikus hibajavítások, osztályok importja és hasonlók.

<figure aria-describedby="caption-attachment-2341" class="wp-caption aligncenter" id="attachment_2341" style="width: 720px">![](assets/uploads/2020/06/30005815/coca.png)<figcaption class="wp-caption-text" id="caption-attachment-2341">A space+a előhozza a kontext menüt, amiben az adott kurzorhoz tartozó műveletek vannak.</figcaption></figure>

Ja igen, a qf, azaz quickfix leütése megpróbálja az adott hibát vagy figyelmeztetést javítani a nyelvi szerver ajánlásai alapján.

A fájlok kezelésére a [NERDTree](https://github.com/preservim/nerdtree) plugin lett a megoldás, ami alapból a képernyő bal szélén jelenik meg, ahogy a képen is látszik. A képen nem látszik, de a megfelelő betűtípussal a fájlok ikonjait is megjeleníti.

A [vim-airline](https://github.com/vim-airline/vim-airline "vim-airline") plugin ad egy szép alsó status bart, ráadásul az aktuális buffert tabok formájában látom vele fent. A powerline fontok letöltése után pedig különösen szép. Mondanom sem kell, tucatjával vannak hozzá a témák, ahogy a vimhez is (én pl a gruvbox témát használom).

Az [auto-pairs](https://github.com/jiangmiao/auto-pairs) automatikusan lezárja a zárójeleket, idézőjeleket helyettem, mint amit a legtöbb IDE is csinál. Mivel az auto pairs pluginnak volt mappingje a space-re, ezt ki kellett kapcsoljam (let g:AutoPairsMapSpace = 0), mert mindig volt egy kb. másodpercnyi csúszás amikor gépeltem és leütöttem a space-t.

A [cosco](https://github.com/lfilho/cosco.vim "cosco") pluginnel egy space+, lenyomása a sor végére biggyeszti a vesszőt vagy pontosvesszőt, attól függ melyik kell az adott helyre.

A [vim-commentary](https://github.com/tpope/vim-commentary) pedig két gombnyomásra kommentez ki kódrészleteket, ha kell.

<figure aria-describedby="caption-attachment-2343" class="wp-caption aligncenter" id="attachment_2343" style="width: 356px">![](assets/uploads/2020/06/01140604/Screenshot-2020-07-01-at-14.05.39.png)<figcaption class="wp-caption-text" id="caption-attachment-2343">Az undotree kis ablaka, amiben tudok lépkedni a módosításaim közt</figcaption></figure>

Az [undotree](https://github.com/mbbill/undotree) segítségével a lokális módosításokat tudom visszanézni, visszavonni. Ezt nálam a space+u szekvencia hozza elő.

De hogy ne csak a featureöket soroljam: igen, lehet használni. Akadnak persze olyan prémium dolgok, amiket egy IDE jobban tud, meg lesznek még álmatlan éjszakáim, mire összehozom, hogy menjen a debugging és a refaktor is rendesen (főleg mert már látom, hogy a végére meg kell írjam magamnak), de amint ezek is megvannak, akkor már igazából nem igazán lesz semmi olyan, amit hiányolnék belőle.

Ez nyílván nem elég a váltáshoz, hiszen nem ugyanazt, hanem valami jobbat akarunk kihozni belőle. Ez a plusz pedig nehezen önthető szavakba, leginkább az érzés, hogy gyorsabbnak érzem magam azáltal, hogy másképp mozgok a rendszeren belül. Mondjuk nem méregettem a sebességet, hogy mennyi idő alatt csinálok meg dolgokat, de igény szerint valami összehasonlító videót majd közzéteszek egy egyszerű feladattal.

![](https://miro.medium.com/max/800/1*vhsWW0X4IZpq1B1bUA4awg.jpeg)