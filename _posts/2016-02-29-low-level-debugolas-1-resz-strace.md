---
id: 107
title: 'Low level debugolás, 1. rész: strace'
date: '2016-02-29T23:27:53+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=107'
permalink: /2016/02/29/low-level-debugolas-1-resz-strace/
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
fusion_builder_status:
    - inactive
avada_post_views_count:
    - '2701'
refaktor_post_views_count:
    - '2451'
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
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/01/29122141/8879202_ml_cropped.jpg'
categories:
    - Fejlesztés
tags:
    - debugging
---

Teljesen mindegy, hogy fejlesztünk vagy üzemeltetünk, időnként előfordul, hogy olyan szoftvert kell életre lehelnünk, amely kódminősége finoman szólva hagy némi kívánni valót maga után. Ilyen esetben nem mindig praktikus elkezdeni a szoftver kódját nézegetni, sokszor célszerűbb sokkal mélyebben nekifogni a feladatnak.

Ebben a cikkben bemutatjuk, hogy hogyan lehet megjeleníteni egy program rendszerhívásait Linux platformon az `strace` utility segítségével.

## Mi is az a rendszerhívás?

Anélkül, hogy részletesen belemennénk az operációs rendszerek lelkivilágába, nézzük meg, hogy tulajdonképpen mi is az a rendszerhívás, vagy angolul system call.

A modern programok két féle üzemmódban futhatnak a processzoron: kernel módban és a user módban. A felhasználói programok, szerver szoftverek jellemzően user módban futnak, ahol a processzor megvédi őket. Ez azt jelenti, hogy nem férhetnek hozzá más programok memóriaterületeihez, nem írhatnak közvetlenül a merevlemezre.

Sok művelethez azonban szükség van a védelem kikapcsolására. Ehhez a programok az operációs rendszer magját szólítják meg, ami kernel módban fut. Mivel a kernel módban futó programok szó szerint mindent megtehetnek, az operációs rendszerek csak egy szűk kódhalmazt futtatnak ebben a módban, ami egy szabványos programfelületen keresztül érhető el.

Azok a függvények, amiket a kernel módban futó rendszermag (avagy: a kernel) biztosít számunkra, *rendszerhívásoknak* nevezzük. Ilyen rendszerhívások például a file megnyitás (`open`), hálózati kapcsolat nyitása (`connect`), stb.

## Mire lesz ez jó nekünk?

Az `strace` programot eredetileg Sun OS-re írták, ma már azonban inkább a Linux rendszereken jellemző. A segítségével kilistázhatjuk, hogy pontosan milyen rendszerhívásokat tesz a programunk, a legegyszerűbben a parancssorból lefuttatva:

```
strace ls /proc

```

Ennek valami ilyesmi kimenete lesz:

```
execve("/bin/ls", ["ls", "/proc"], [/* 19 vars */]) = 0
brk(0)                                  = 0x1097000
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f0bb0334000
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
open("/etc/ld.so.cache", O_RDONLY)      = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=22620, ...}) = 0
mmap(NULL, 22620, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f0bb032e000
close(3)                                = 0
open("/lib64/librt.so.1", O_RDONLY)     = 3
...

```

Elsőre teljes kavarnak tűnik, azonban ha jobban megnézzük, ezek tulajdonképpen programkódra hasonlítanak, a sor végén a visszatérési értékekkel kiegészítve. Ha kicsit megszűrjük a kimenetet és megmondjuk az strace-nek, hogy mely rendszerhívásokat listázza ki:

```
strace -e trace=stat,open,read,write,readv,writev,recv,recvfrom,send,sendto ls /proc

```

```
open("/etc/ld.so.cache", O_RDONLY)      = 3
open("/lib64/librt.so.1", O_RDONLY)     = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\340\"\0\0\0\0\0\0"..., 832) = 832
open("/lib64/libcap.so.2", O_RDONLY)    = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\220\26\0\0\0\0\0\0"..., 832) = 832
open("/lib64/libacl.so.1", O_RDONLY)    = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\340#\0\0\0\0\0\0"..., 832) = 832
open("/lib64/libc.so.6", O_RDONLY)      = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0000\356\1\0\0\0\0\0"..., 832) = 832
open("/lib64/libpthread.so.0", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\300\\\0\0\0\0\0\0"..., 832) = 832
open("/lib64/libattr.so.1", O_RDONLY)   = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0 \26\0\0\0\0\0\0"..., 832) = 832
open("/proc", O_RDONLY|O_NONBLOCK|O_DIRECTORY|O_CLOEXEC) = 3
write(1, "1      13239  14532  22092  2209"..., 1761      13239  14532  22092  22094  22096  247  447  574  8517      cpuinfo  fairsched   filesystems  kmsg     locks    mounts  self  swaps  sysrq-trigger  uptime         version  vz
) = 176
write(1, "13238  14496  14533  22093  2209"..., 16913238  14496  14533  22093  22095  22097  446  559  649  cmdline  devices  fairsched2  fs        loadavg  meminfo  net     stat  sys    sysvipc    user_beancounters  vmstat
) = 169

```

Mint látható, így már csak a kívánt rendszerhívásokat kapjuk meg. A lehetséges hívások listáját a `man` parancs adja meg:

```
man 2 syscalls

```

<div class="warning">**Figyelem!** A SUID beállítással futó programok, pl. `suexec` az Apache webszerverben, nem működnek a `strace` programmal!</div>## Tippek és trükkök

### A kiírt stringek hosszának megemelése

<span class="s1">Sok rendszerhívás – például a hálózati kapcsolatokba való írás, vagy azokból való olvasás – több adatot ad át, mint amit a strace parancs alapértelmezetten kiír.</span> Ha szeretnénk a teljes adatfolyamot látni, meg kell emelni a kiírt szövegek hosszát:

```
strace -s 999 ls /proc

```

<span class="s1">Így könnyebbé válhat a hálózati kapcsolatok elemzése. Azonban ne felejtsük el, hogy az esetleges titkosítás alkalmazás-szinten történik, azaz a strace kimenetben már a titkosított adatfolyam lesz. </span>A titkosítás megkerüléséről egy későbbi cikkben lesz szó.

### Már futó programok elemzése

Az strace nem csak az általa elindított programokat képes elemezni, hanem már futó programokat is, akár többet egyszerre is. Ehhez szükségünk van a futó program PID-jére, amit az `ps auwfx` parancs kiír. A szintaxis meglehetősen egyszerű:

```
strace -p 1234 -p 1235

```

Ha nincs root jogunk az adott gépen, akkor természetesen csak a saját processzeinket tudjuk elemezni.

### Processzek követése

Sok szerver-jellegű program (Apache, PHP, stb) nem pusztán egy szálon dolgozik, hanem mindjárt több processzt is nyit. Ezeket strace-ben a `-f` kapcsolóval követhetjük. (Ez esetben a processz ID kiíródik a sor elejére.)

### Webalkalmazások elemzése

Webalkalmazások általában egy webszerverben, vagy önálló daemonban futnak. Ezek általában több mint egy processzt indítanak, így fel kell használnunk az előző részekben tárgyaltakat az összes processz figyeléséhez.

Először megkeressük a megfelelő processzek listáját:

PHP-FPM:

```
ps auwfx |grep [p]hp

```

Apache:

```
ps auwfx |grep [a]pache

```

Ezt kiegészítjük azzal, hogy kiszűrjük a PID-eket, és kiírjuk `-p` kapcsolóval:

PHP-FPM:

```
ps auwfx |grep [p]hp | awk ' { print $2 } ' \
 | xargs -i echo -n ' -p {}'

```

Apache:

```
ps auwfx |grep [a]pache | awk ' { print $2 } ' \
 | xargs -i echo -n ' -p {}'

```

Ezt a kimenetet belírjuk az strace parancsba:

PHP-FPM:

```
strace \
 -e trace=open,read,write,readv,writev,recv,recvfrom,send,sendto \
 -f -s 999 \
 $(ps auwfx |grep [p]hp | awk ' { print $2 } ' \
 | xargs -i echo -n ' -p {}')

```

Apache:

```
strace \
 -e trace=open,read,write,readv,writev,recv,recvfrom,send,sendto \
 -f -s 999 \
 $(ps auwfx |grep [a]pache | awk ' { print $2 } ' \
 | xargs -i echo -n ' -p {}')

```

Ha megnézzük ezután a kimenetet, ilyeneket látunk:

```
Process 6883 attached - interrupt to quit
Process 6888 attached - interrupt to quit
Process 6889 attached - interrupt to quit
Process 6890 attached - interrupt to quit
Process 6891 attached - interrupt to quit
Process 6892 attached - interrupt to quit
Process 6894 attached - interrupt to quit
Process 6895 attached - interrupt to quit
Process 6896 attached - interrupt to quit
[pid  6892] read(8, "GET /test.php HTTP/1.1\r\nHost: stuff.localhost\r\nUser-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:11.0) Gecko/20100101 Firefox/11.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-us,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nReferer: http://stuff.localhost/\r\nCache-Control: max-age=0\r\n\r\n", 8000) = 361
[pid  6892] open("/.htaccess", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
[pid  6892] open("/var/.htaccess", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
[pid  6892] open("/var/www/.htaccess", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
[pid  6892] open("/var/www/stuff.localhost/.htaccess", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
[pid  6892] open("/var/www/stuff.localhost/htdocs/.htaccess", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)
[pid  6892] open("/var/www/stuff.localhost/htdocs/test.php/.htaccess", O_RDONLY|O_CLOEXEC) = -1 ENOTDIR (Not a directory)
[pid  6892] open("/var/www/stuff.localhost/htdocs/test.php", O_RDONLY) = 9
[pid  6892] open("/dev/urandom", O_RDONLY) = 9
[pid  6892] read(9, "\255\263\316-\306C\273\2", 8) = 8
[pid  6892] open("/dev/urandom", O_RDONLY) = 9
[pid  6892] read(9, "9\326|\367v2\21\315", 8) = 8
[pid  6892] open("/dev/urandom", O_RDONLY) = 9
[pid  6892] read(9, "5\5\305,`J\201 ", 8) = 8
[pid  6892] writev(8, [{"HTTP/1.1 200 OK\r\nDate: Thu, 19 Apr 2012 11:29:29 GMT\r\nServer: Apache/2.2.20 (Ubuntu)\r\nX-Powered-By: PHP/5.3.6-13ubuntu3.6\r\nVary: Accept-Encoding\r\nContent-Encoding: gzip\r\nContent-Length: 32\r\nKeep-Alive: timeout=5, max=100\r\nConnection: Keep-Alive\r\nContent-Type: text/html\r\n\r\n", 273}, {"\37\213\10\0\0\0\0\0\0\3", 10}, {"\363H\315\311\311W\10\317/\312IQ\4\0", 14}, {"\243\34)\34\f\0\0\0", 8}], 4) = 305
[pid  6892] read(8, 0x7fa392c8e048, 8000) = -1 EAGAIN (Resource temporarily unavailable)
[pid  6892] write(6, "stuff.localhost:80 127.0.0.1 - - [19/Apr/2012:13:29:29 +0200] \"GET /test.php HTTP/1.1\" 200 305 \"http://stuff.localhost/\" \"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:11.0) Gecko/20100101 Firefox/11.0\"\n", 200) = 200

```

Mint látható, ebben a példában az Apache webszerver a lekérdezés feldolgozása közben végig olvassa a `.htaccess` fájlok lehetséges helyeit, majd visszaküldi az eredményt.

## Összegzés

Mint látható, az strace egy igen hasznos eszköz, ha az alkalmazások külső kommunikációját, vagy fájlműveleteit akarjuk elemezni. A sorozat következő részében a hálózati kapcsolatok mélyebb elemzésével fogunk foglalkozni.