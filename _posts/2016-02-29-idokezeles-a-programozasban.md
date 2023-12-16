---
id: 12
title: 'Időkezelés a programozásban'
date: '2016-02-29T23:25:14+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=12'
permalink: /2016/02/29/idokezeles-a-programozasban/
pyre_show_first_featured_image:
    - 'yes'
pyre_portfolio_width_100:
    - default
pyre_video:
    - ''
pyre_fimg_width:
    - ''
pyre_fimg_height:
    - ''
pyre_image_rollover_icons:
    - 'no'
pyre_link_icon_url:
    - ''
pyre_post_links_target:
    - 'no'
pyre_related_posts:
    - default
pyre_share_box:
    - default
pyre_post_pagination:
    - default
pyre_author_info:
    - default
pyre_post_meta:
    - default
pyre_post_comments:
    - default
pyre_main_top_padding:
    - ''
pyre_main_bottom_padding:
    - ''
pyre_hundredp_padding:
    - ''
pyre_slider_position:
    - default
pyre_slider_type:
    - 'no'
pyre_slider:
    - '0'
pyre_wooslider:
    - '0'
pyre_revslider:
    - '0'
pyre_elasticslider:
    - '0'
pyre_fallback:
    - ''
pyre_avada_rev_styles:
    - default
pyre_display_header:
    - 'yes'
pyre_header_100_width:
    - default
pyre_header_bg:
    - ''
pyre_header_bg_color:
    - ''
pyre_header_bg_opacity:
    - ''
pyre_header_bg_full:
    - 'no'
pyre_header_bg_repeat:
    - repeat
pyre_displayed_menu:
    - default
pyre_display_footer:
    - default
pyre_display_copyright:
    - default
pyre_footer_100_width:
    - default
pyre_sidebar_position:
    - default
pyre_sidebar_bg_color:
    - ''
pyre_page_bg_layout:
    - default
pyre_page_bg:
    - ''
pyre_page_bg_color:
    - ''
pyre_page_bg_full:
    - 'no'
pyre_page_bg_repeat:
    - repeat
pyre_wide_page_bg:
    - ''
pyre_wide_page_bg_color:
    - ''
pyre_wide_page_bg_full:
    - 'no'
pyre_wide_page_bg_repeat:
    - repeat
pyre_page_title:
    - default
pyre_page_title_text:
    - default
pyre_page_title_text_alignment:
    - default
pyre_page_title_100_width:
    - default
pyre_page_title_custom_text:
    - ''
pyre_page_title_text_size:
    - ''
pyre_page_title_custom_subheader:
    - ''
pyre_page_title_custom_subheader_text_size:
    - ''
pyre_page_title_font_color:
    - ''
pyre_page_title_height:
    - ''
pyre_page_title_mobile_height:
    - ''
pyre_page_title_bar_bg:
    - ''
pyre_page_title_bar_bg_retina:
    - ''
pyre_page_title_bar_bg_color:
    - ''
pyre_page_title_bar_borders_color:
    - ''
pyre_page_title_bar_bg_full:
    - default
pyre_page_title_bg_parallax:
    - default
pyre_page_title_breadcrumbs_search_bar:
    - default
avada_post_views_count:
    - '2507'
fusion_builder_status:
    - inactive
refaktor_post_views_count:
    - '2287'
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:0:"";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/01/29122121/4253427_ml.jpg'
categories:
    - Fejlesztés
tags:
    - 'clean code'
---

Talán nincs még egy olyan téma a fejlesztés terén, ahol annyi hibát és téves értelmezést látok, mint az időkezelésben. Tény, hogy valóban nem egyszerű kérdés, rengeteg mindennel kell foglalkoznunk, az időzónáktól kezdve, a téli/nyári időszámításon át, a szökőmásodpercekig.

Sokan azt gondolják, hogy elegendő minden időt UTC-ben tárolni, ám sajnos ez még mindig nem elegendő ahhoz, hogy helyesen kezeljük az idő-jellegű adatainkat.

## Az elmélet

A számítástechnika hajnalán az időszámításra egy igen egyszerű megoldást választottak: 1970. január 1-étől számolták a másodperceket, UTC időzónában. Ez az időszámítás lett a [UNIX timestamp](https://hu.wikipedia.org/wiki/Unix-id%C5%91). A UNIX idő hatalmas előnye, hogy egyszerű vele számolni. Az idő-adatok egész szám formában tárolhatóak, és két idő közötti különbség egy egyszerű matematikai művelettel kiszámolható. Egy óra 3600, egy nap 86400 másodperc.

A rendszer megalkotói azonban nem számoltak azzal, hogy a különböző programok fejlesztői ezeket a törvényszerűségeket milyen mélyen beépítik a programjaikba, és ez milyen problémákat okozhat. Az UTC időzónát ugyanis nem szabályos időközönként hozzáigazítják az UT1 időzónához, ami közvetlenül követi a Föld forgását. Ezt a hozzáigazítást egy úgynevezett szökőmásodperc betoldásával oldják meg. Tehát lesz olyan nap, amely nem 86400, hanem 86401 másodpercből áll. Egy ilyen szökőmásodperc volt 2015. június 30. 23:59:60, azaz a nap utolsó másodperce nem 59 volt, hanem 60. Ez a látszólag ártalmatlan plusz másodperc hatalmas problémákat tud okozni, mint azt az elmúlt pár szökőmásodperc bizonyította is.

Tovább bonyolítja a helyzetet, ha nem UTC-ben szeretnénk kezelni az időt, hanem helyi időben. Ekkor ugyanis helytől függően évente kétszer bejön az óraátállítás is.

Ráadásul időnként az is előfordul, hogy egy-egy ország politikai vagy gazdasági okokból úgy dönt, hogy időzónát vált vagy téli/nyári időszámítást vezet be. Ilyen történt például 2011-ben, amikoris Samoa egy egész napot kihagyva átugrott a dátumválasztó vonal egyik oldaláról a másikra.

## Példa

Nézzünk egy példát, a jelenlegi időhöz hozzáadunk 3 napot:

\[fusion\_tabs design="classic" layout="horizontal"\]  
\[fusion\_tab title="PHP"\]

```
echo(
  date(
    "Y-m-d H:i:s",
    time()+86400*3
  )
);
```

\[/fusion\_tab\]  
\[fusion\_tab title="Python" icon=""\]

```
import time
import datetime
timestamp = int(time.time()) + 86400*3
print(datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S'))
```

\[/fusion\_tab\]  
\[/fusion\_tabs\]

Ez szép és jó, jó eséllyel pontosan megadja a jelenlegi időt 3 nap múlva. De nézzük, mi történik, ha 2012. március 23. 23:00-t vesszük, CEST időzónában:

\[fusion\_tabs design="classic" layout="horizontal"\]  
\[fusion\_tab title="PHP"\]

```
date_default_timezone_set('Europe/Budapest');
echo(
  date(
    "Y-m-d H:i:s",
    mktime(23, 0, 0, 3, 23, 2012)+86400*3
  )
);
```

\[/fusion\_tab\]  
\[fusion\_tab title="Python" icon=""\]

```
import datetime
import time
import pytz

d = datetime.datetime(2012, 3, 23, 23, 0, 0, 0, pytz.timezone('Europe/Budapest'))
unixtime = time.mktime(d.timetuple())

print(
  datetime.datetime.fromtimestamp(
    unixtime + 86400 * 3,
    pytz.timezone('Europe/Budapest')
  ).strftime('%Y-%m-%d %H:%M:%S')
)
```

\[/fusion\_tab\]  
\[/fusion\_tabs\]

Azt várnánk, hogy március 26. 23:00-t kapunk, helyette azonban március 27-én 00:00-t kapunk. Ha egyszerűen levágjuk az óra részt, vagy kerekítünk, akkor nem azt a napot kapjuk, amit várunk. Ez például egy szolgáltatás lejáratnál adott esetben katasztrofális következményekkel járhat.

## Időkezelés modern számítógépes rendszerekben

Mint látjuk, az időkezelés pusztán másodperc alapon minimum problémás. Szerencsére az IANA, a nemzetközi számkiosztásért felelős szervezet, egy [naprakész adatfájlt tart fent](https://www.iana.org/time-zones) az ilyen változásokról. Ezeket gyakran *tz*, *tzdata* vagy *zoneinfo* néven is emlegetjük.

A zoneinfo adatbázis kezelését nem nekünk kell leprogramoznunk, ezt az operációs rendszerhez mellékelt programkönyvtárak megoldják. A modern programnyelvek ezeket a könyvtárakat felhasználva, függvényeket vagy osztályokat biztosítanak a megfelelő időkezeléshez.

Az előző példát véve, nézzük hogyan kellene ezt helyesen megoldani:

\[fusion\_tabs design="classic" layout="horizontal"\]  
\[fusion\_tab title="PHP"\]

```
date_default_timezone_set('Europe/Budapest');
$date = new DateTime('2012-03-23 23:00:00');
$date->add(new DateInterval('P3D'));
echo $date->format('Y-m-d H:i:s');
```

\[/fusion\_tab\]  
\[fusion\_tab title="Python" icon=""\]

```
import datetime
import pytz

d = datetime.datetime(2012, 3, 23, 23, 0, 0, 0, pytz.timezone('Europe/Budapest'))
print(
  format(
    d + datetime.timedelta(days=3), '%Y-%m-%d %H:%M:%S'
  )
)
```

\[/fusion\_tab\]  
\[/fusion\_tabs\]

Ha ezt a kódot lefuttatjuk, a várt eredményt kapjuk: 2012-03-26 23:00:00.

## Összegzés

A mai napig nincs tiszta fogalmunk az idő múlásáról, és a bolygónk forgásához próbáljuk igazítani, ami egy tökéletlen módszer. Sajnos az alternatív időszámolási rendszerek nem terjedtek el széles körben, ezért a jelenlegi rendszerrel kell dolgoznunk.

Tekintettel a feladat komplexitására, senkinek nem javaslom, hogy saját maga próbálja meg implementálni az időkezelést, inkább használja a nyelvben közvetlenül, vagy függvénykönyvtárak által biztosított API-kat.  
\[alert type="notice" accent\_color="" background\_color="" border\_size="1px" icon="" box\_shadow="yes" animation\_type="0" animation\_direction="down" animation\_speed="0.1" animation\_offset="" class="" id=""\]Néha szükség van arra, hogy tényleg másodperceket számoljunk. Ilyenkor nagyon óvatosan kell eljárni, hogy a futtatókörnyezet időzóna-beállításai, és a szökőmásodpercek ne befolyásolhassák az eredményt.\[/alert\]