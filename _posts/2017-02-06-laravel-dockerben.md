---
id: 1497
title: 'Laravel dockerben'
date: '2017-02-06T00:53:59+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1497'
permalink: /2017/02/06/laravel-dockerben/
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
dsq_needs_sync:
    - '1'
    - '1'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/07/09202214/afus.png'
categories:
    - Backend
    - Laravel
tags:
    - cron
    - docker
    - job
    - laravel
    - php
    - queue
    - schedule
    - worker
---

A [korábbiakban]({{ site.url }}/2016/12/31/php-docker-moge-bujva/) már láthattuk, hogy is tudunk apache alapú webszervert futtatni, azonban akadnak esetek, főleg ha a Laravel eszközkészletét vesszük figyelembe, mikor egy szimpla webszervernél több kell, vegyük csak a workereket, scheduled jobokat. A docker alapvetően egy process-t (és azokat, amiket az spawnolt) tud futtatni és addig tart egy konténer futása, amíg a process tart, ennélfogva fontos, hogy az úgymond foreground fusson, tehát ne daemonként.

Most nézzük meg, hogy is hívhatjuk segítségül a supervisord-t és indítsunk konténert cronnal workerekkel és futó apache-al! [![](assets/uploads/2017/01/Multitasking.jpg)  ](assets/uploads/2017/01/Multitasking.jpg)

A fentebb említett supervisor egy ún. process control system, vagyis futó processek menedzselésére szolgál, azokat felügyeli, ahogy a nevéből is látszik. Na de hogy jön ez ide Nekünk?

Ha megnézzük a korábban használt php-apache imageünket, akkor láthatjuk, hogy bizony ez az apache-ot futtatja foreground módon:

```
EXPOSE 80
CMD ["apache2-foreground"]
```

A fenti parancs egy shell script, ami a háttérben:

```
<span class="pl-c1">exec</span> apache2 -DFOREGROUND <span class="pl-s"><span class="pl-pds">"</span><span class="pl-smi">$@</span><span class="pl-pds">"
</span></span>
```

Ezzel a paranccsal fogja elindítani az apache-ot. Az, hogy supervisorral tudjuk futtatni a dolgot sem igényel sok kozmetikázást.

Ugye a CMD-t vagyis a belépési pontot a saját Dockerfile-unkban felül tudjuk bírálni. A mienk így fog kinézni:

```
FROM php:7.1-apache

CMD ["/usr/bin/supervisord"]
```

Tehát annyit csinál, hogy elindítja a supervisor daemont. Ahhoz, hogy ott legyen, fel kell telepítsük előtte:

```
RUN apt-get -y install supervisor
```

Na meg az se árt, ha konfigurációja is van. Ehhez az kell, hogy az aktuális WORKDIR-be (/var/www/html a php-apache esetében) bekerüljön a supervisord.conf fájl.

```
COPY . /var/www/html
```

Mivel minden fájlt bemásolunk ide, ennélfogva a projektünk gyökerében kell elhelyezni ezt a fájlt.

A tartalma most valami hasonló legyen:

```
[program:apache2]
autorestart=true
autostart=true
command=/bin/bash -c "source /etc/apache2/envvars && exec /usr/sbin/apache2 -DFOREGROUND"
```

Ezzel definiáltuk is az apache2 nevű programot, hogy a supervisord menedzselje. Az autorestart és autostart egyértelmű, a command lesz a futtatott parancs, ami itt igazából berángatja a környezeti változókat és utána foreground módban indítja az apache-ot.

Ha elindítjuk a konténert, amit ebből az image-ből buildelünk, akkor a default parancs, az lesz, hogy elindítja a supervisord-t, az pedig elindítja az apache-ot. Na de itt a lényeg pont az lenne, hogy ne egy process fusson, hanem több. Nem lesz vészes hozzáadni újabb parancsokat, inkább azok szintaxisa lehet trükkös.

Mi lehet az, amit futtatni akarunk? Hát különféle jobokat, mégpedig időzített jobokat, amik adott időpontban futnak el, valamint ún. consumereket, amik job queue-ból fogják feldolgozni a feladatokat. Az előbbi lehet pl. hírlevél kiküldés, különböző maintenance feladatok, utóbbi pedig szinte bármi, amivel nem akarjuk lassítani az oldalunkat, ezáltal rontani a user experience-t. Ilyen lehet pl. az elfelejtett jelszó/regisztrációs e-mail kiküldés, amik tipikusan problémásak lehetnek, ha épp lassan reagál a mail szerver, netán lehalt és a felhasználónk pedig nem szívesen várja végig az X másodperc timeoutot. Ráadásul ha nem sikerül elküldeni, akkor a usernek kell újrapróbálnia. Ellenben ha ún, jobqueue-t használunk, akkor lehetőségünk van újrapróbálni mindezt, hiszen ez a háttérben fut és időnk mint a tenger 🙂

Akkor nézzük először is az időzített jobokat, az az egyszerűbb eset, mert azt csak végre kell hajtani, nem?

Na de ezt bárki tudja hogy kell, nemde? Csinálunk egy cronjobot és jónapot', ugye? Hát azért annyira nem, mert nem szeretnénk magát az imaget piszkálni újra és újra, ezért a Laravel segítségét hívjuk az ügyben. Ezek az ún. Scheduled taskok lesznek.

Sajnos a cront nem tudjuk kihagyni az ügyből, ezért muszáj lesz felvennünk egy új jobot a crontabra, ami minden percben lefut és ráhív a laravel artisan parancsára és annak mindenféle kimenetét beleirányítja a nagy semmibe, így nem lesz kimenetünk, max logolni tudunk (ez fontos, mert sokan foghatják a fejüket, ha csak var\_dumpolnak a kódban amikor tesztelik :D):

```
* * * * * php /var/www/html/artisan schedule:run >> /dev/null 2>&1
```

Alapesetben semmi sincs felregisztrálva a Laravelben, ezért hiába hívjuk percenként a dolgot, nem történik semmi, ellenben jó volna látni is valamit, nemde? Ezt a feliratkozást az `app/console/Kernel.php` fájljában tudjuk megtenni:

```
/**
 * Define the application's command schedule.
 *
 * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
 * @return void
 */
protected function schedule(Schedule $schedule)
{
    $schedule->command('cron:test')->everyMinute();

}
```

Ahhoz, hogy ez menjen, létre kell hozni a Test commandot:

```
php artisan make:command Test
```

Editáljuk a parancsot, amire hallgat:

```
class Test extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cron:test';
```

Na meg nem árt, ha csinál is valamit:

```
/**
 * Execute the console command.
 *
 * @return mixed
 */
public function handle()
{
    \Log::info("invoked");
}
```

Majd fel kell venni az iménti Kernel.php-ben:

```
/**
 * The Artisan commands provided by your application.
 *
 * @var array
 */
protected $commands = [
    Test::class
];
```

Ezzel meg is volnánk azzal, hogyha lokálisan betennénk azt a fenti sort a crontabba, meghívná a laravelt és percenként logolna egy `'[INFO] invoked'` stringet. Na de itt kezdődik az, hogy megspórolok nektek egy kis időt, mert én már szívtam ezzel 🙂

Ahhoz, hogy menjen a cron, először is fel kell telepítenünk, úgyhogy egészítsük ki a Dockerfile elején az apt-get install szekciót:

```
# we need unzip and git for composer
RUN apt-get update && apt-get -y install git unzip supervisor cron
```

A cron ezzel feltelepült, nézzük mi a következő lépés. Kell nekünk egy crontab fájl a projekt gyökerébe:

```
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

* * * * * root php /var/www/html/artisan schedule:run >> /dev/null 2>&1
# Empty line
```

Igen, az üres sor kell a crontabhoz, hogy valid legyen, valamint alapból a cron nem látná a php-t, ezért itt megadjuk neki.

Ezután be kell kerüljön a crontab a megfelelő helyére, így visszamegyünk a Dockerfilehoz:

```
# Add crontab file in the cron directory
ADD crontab /etc/cron.d/lara-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/lara-cron
```

A cron.d-ben felvett fájlokon végigmegy a cron és beszipkázza a tartalmát, így tesz majd a mienkkel is! Na most akkor nézzük meg, hoggy is néz ki a komplett Dockerfile:

```
FROM php:7.1-apache
MAINTAINER Papp Krisztian <fejlesztes@letscode.hu>

# we need unzip and git for composer
RUN apt-get update && apt-get -y install git unzip supervisor cron

RUN docker-php-ext-install pdo_mysql

# replacing the docroot
RUN sed -i 's/\/var\/www\/html/\/var\/www\/html\/public/g' /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite

COPY . /var/www/html

RUN chown www-data:www-data -R /var/www/html

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

RUN php composer.phar install

RUN ./vendor/phpunit/phpunit/phpunit # amennyiben még nincs tesztünk, ezt kiszedhetjük

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/lara-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/lara-cron


CMD ["/usr/bin/supervisord"]
```

Akkor buildeljük le és várjuk a csodát 🙂

```
docker build -t laradock .
```

Ezután indítsuk el:

```
docker run --name laradock -d laradock
```

Majd figyeljük a logot, hogy történik-e valami:

```
docker exec -it laradock tail -f /var/www/html/storage/logs/laravel.log
```

Ha mindent jól csináltunk, akkor valami hasonlót fogunk látni:

```
[2017-02-05 15:43:01] local.INFO: invoked 
[2017-02-05 15:44:01] local.INFO: invoked
```

Ez az, a cronjob működik!

Akkor jöjjenek azok a bizonyos workerek!

Ezek már némileg másképp működnek, ugyanis egy ilyen sornak két vége van, tehát ahhoz, hogy tesztelni tudjuk nem elég, hogyha leemelgetünk a sorról feladatokat, hanem valahol rá is rakjuk őket. Ezek a jobok igazából serializált osztályként fognak megjelenni valahol, attól függően, hogy épp milyen drivert is használunk. Mi most a legegyszerűbbet fogjuk használni, mégpedig az SQL adatbázist.

Először is hozzunk létre egy jobot, ami hasonló kimenetet produkál, mint az előző.

```
php artisan make:job Test
```

Ebbe is kerüljön bele a logolás:

```
private $message;

/**
 * Create a new job instance.
 *
 * @return void
 */
public function __construct($message)
{
    $this->message = $message;
}

/**
 * Execute the job.
 *
 * @return void
 */
public function handle()
{
    \Log::info("job with '$this->message' executed!");
}
```

Mivel adatbázist használunk, ezért hozzuk létre ott is a migrációs táblát, amiben ezek a jobok tárolódnak. Az egyszerűség kedvéért hozzunk létre egy üres fájlt:` database/database.sqlite`

Ezek után a .env fájlból töröljük a DB prefixű sorokat és csak az alábbi maradjon:

```
DB_CONNECTION=sqlite
```

valamint itt írjuk át:

```
QUEUE_DRIVER=database
```

Így a fenti fájlt fogja sqlite adatbázisként használni a továbbiakban.

Hozzuk létre a migrációs táblát és migráljunk az adatbázisba:

```
php artisan queue:table
php artisan migrate
```

Adjunk hozzá egy olyan endpointot, amit ha meglövünk, bedob egy ilyen jobot a queue-ba:

```
Route::get('/test', function (\Illuminate\Http\Request $request) {
    dispatch(new \App\Jobs\Test($request->input("message")));
    return view('welcome');
});
```

Tehát ha meglőjük a /test?message=valamilyenszoveg-et, akkor a logba kerül az alábbi sor:

```
[2017-02-05 17:41:03] local.INFO: job with 'valamilyenszoveg' executed!
```

Na akkor már csak a supervisor kellő nekünk, hogy fussanak azok az ún. workerek, amik majd csemegéznek erről a queue-ról, így illesszük be az alábbi részletet a supervisord.conf-ba:

```
[program:laravel-worker]
command=php /var/www/html/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/www/html/worker.log
```

Ezáltal indít egy workert, ami háromszor próbálja újra az egyes feladatokat és három másodpercet vár, ha épp kiürült a sor. (a laraveles példában 8 processt enged rá, de azok dobálják a hibákat sqlite esetén, mert locked maga a fájl).

Akkor most indítsuk el:

```
docker run -d --name laradock -p 8888:80 laradock
```

Ezután ugyanúgy figyeljük a logfájlt:

```
docker exec -it laradock tail -f /var/www/html/storage/logs/laravel.log
```

lőjük meg párszor a` localhost:8888/test?message=valamilyenszoveg`-et és az alábbi logkimenetre számítunk:

```
[2017-02-05 17:49:02] local.INFO: job with 'valamilyenszoveg' executed! 
[2017-02-05 17:49:05] local.INFO: job with 'valamilyenszoveg' executed! 
[2017-02-05 17:49:08] local.INFO: job with 'valamilyenszoveg' executed! 
[2017-02-05 17:49:09] local.INFO: job with 'valamilyenszoveg' executed! 
[2017-02-05 17:49:12] local.INFO: job with 'valamilyenszoveg' executed! 
[2017-02-05 17:49:12] local.INFO: job with 'valamilyenszoveg' executed!
```

Persze mindeközben a kis cronjob is fut a háttérben, úgyhogy már háromféle dolgot csinálunk, mindezt egy konténerbe csomagolva 🙂