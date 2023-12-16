---
id: 1432
title: 'Konstruáljunk web API-t &#8211; Passporticus maximus'
date: '2017-01-15T01:10:12+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1432'
permalink: /2017/01/15/konstrualjunk-web-api-t-passporticus-maximus/
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
image: 'assets/uploads/2017/01/12213001/cuba.jpg'
categories:
    - Laravel
    - PHP
tags:
    - auth
    - client
    - composer
    - guard
    - laravel
    - login
    - oauth
    - passport
    - php
    - token
---

Az [előző cikkben]({{ site.url }}/2016/12/22/oauth-2-0-apigility-modra/) láthattuk, hogy az Apigility, habár nagyon sok mindenben megkönnyíti az ügyünket, amikor az OAuth dolgaira kerül a sor, itt sem ússzuk meg azt, hogy belemásszunk a rendszerbe. A mostani cikkben arra vagyunk kiváncsiak, hogy vajon a Laravel 5.3-al érkező modul, a Passport mennyivel lesz jobb/rosszabb megoldás.

[![](assets/uploads/2017/01/cuba.jpg)](assets/uploads/2017/01/cuba.jpg)

A Passport a Laravel 5.3 része, ennélfogva nem árt, hogyha [upgradeljük](https://laravel.com/docs/5.3/upgrade) azt előtte (ha esetleg [dockerbe]({{ site.url }}/2016/12/31/php-docker-moge-bujva/) szeretnénk tenni). Ha ezzel megvagyunk, akkor már csak fel kell telepítenünk az ide tartozó csomagot:

```
composer require laravel/passport
```

Ha ezzel megvolnánk, akkor jöhet a szokásos Laravel feketemágia, mégpedig az, hogy beregisztráljuk a csomaggal érkező ServiceProvidert a `config/app.php`-ben a `providers` tömbbe:

```
Laravel\Passport\PassportServiceProvider::class
```

Most, hogy már az alkalmazásunk rálát a Passport nyújtotta szolgáltatásokra, futtassuk le a migrációt, amit regisztrált nekünk!

```
php artisan migrate
```

A kreált táblák nagyban hasonlítanak az apigilitysre, de ez nyílván az OAuth specifikációja miatt van így.

Viszont a táblák még üresek, ennélfogva szükségünk lesz kulcsokra, amik segítségével használjuk majd, ezeket a

```
php artisan passport:install
```

segítségével tudjuk véghezvinni. A konzolból jól látszik, hogy csinált két klienst is, egyik ún. personal access, a másik pedig ún. password grant kliens. Ezekről mindjárt beszélünk bővebben. Na most ahhoz, hogy egy felhasználónak tudjunk tokent adni, szükség lesz arra, hogy tudja a Passport, hogy ő bizony kaphat tokent. Ezért adjunk hozzá a `HasApiTokens` trait-et a `User` modelünkhöz:

```
class User extends Authenticatable
{
    use Notifiable, HasApiTokens;
```

Ez egy csomó helper metódust fog számunkra biztosítani, amikkel azonosítani tudjuk a felhasználót, tokent lekérni, stb.

Most haladjunk még egy lépést előre és regisztráljuk be a szükséges endpointokat. Ehhez az AuthServiceProviderünk boot metódusában be kell regisztrálnunk azokat:

```
public function boot()
{
    $this->registerPolicies();

    Passport::routes();
    
}
```

Ezáltal a route-ok bekerülnek, viszont továbbra sem tud minket authentikálni a rendszer, mert nem ő van kijelölve, mint felelős. Ahhoz, hogy ezt is megtegyük, vegyük fel a `config/auth.php`-ben:

```
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

Ezáltal ha egy auth:api middleware-el védünk le egy route-ot, akkor már a passportot fogja meghívni, nem pedig api\_token fieldet keres a users táblában az adott user mellé. Bamm, akkor mostmár megy igaz? Bizony, az alapja ez az egésznek, de majd rálesünk hogy is kell személyre szabni az egészet. Az alap guide egy vue.js-es frontendet röttyintetne össze velünk, de minket most a backend érdekel, a frontendet majd mi megírjuk [Angular 2]({{ site.url }}/2016/12/04/angular-typescript-modra-3-resz/)-ben, igaz?:)

Nézzük meg, hogy milyen route-ok lettek beregisztrálva, hogy tudjuk mire lövünk:

```
php artisan route:list
```

Az eredmény egy szép lista lesz:

[![](assets/uploads/2017/01/Selection_089-1024x333.png)](assets/uploads/2017/01/Selection_089.png)

Na most, ha emlékszünk még az Oauthos alapokra, akkor tudjuk, hogy mi most nem egy kliens nevében, hanem egy felhasználó nevében szeretnénk valamit csinálni. De nézzük meg, hogy mire is gondolunk most?

Hozzunk létre egy klienst magunknak:

```
php artisan passport:client
```

Adjuk meg a nevét, az ID-t és a redirect URL-t.

Lőjük meg egy GET kéréssel a fent látható URL-ek közül az authorize-ot:

```
GET /oauth/authorize?response_type=code&client_id=CLIENT_ID
```

> Emlékszünk még az apigility-re, ugye? Az biza már itt is megkövetelte a `redirect_uri` paraméter meglétét.

Na most a szomorú történet az, hogy redirektálnak minket a /login oldalra, ahol egy jól szituált 404 fogad bennünket. Bizony, szükségünk lesz egy bejelentkezett userre ebben az esetben. Ahhoz pedig létre kell azt hoznunk és a bejelentkező felület dolgait be kell húzzuk:

```
php artisan make:auth
```

Ezzel behúztuk a loginhoz tartozó view-t és route-okat, így a /login már bejön rendesen, viszont a users táblánk töküres. Tegyünk bele egy usert! Hozzuk elő az interaktív shellt:

```
php artisan tinker
```

Azután pedig hozzunk létre egy usert:

```
$u = new App\User();
$u->email = "test@test.hu";
$u->password = bcrypt("test");
$u->name = "Dezső";
$u->save();
```

Ezzel létre is hoztuk a felhasználót, akinek a segítségével már be tudunk lépni, ahol az alábbi képernyő fogad:  
[![](assets/uploads/2017/01/Selection_090.png)](assets/uploads/2017/01/Selection_090.png)  
Ha rányomunk az Authorize-ra, akkor átirányít a megadott callback URL-re, amit bizony már nekünk kell implementálnunk. Na itt kezdődik a mi alkalmazásunk, a kliens kódja. Itt többféle lehetőség áll előttünk. Az egyik ilyen lehetőség, hogy a kliensünk ugyanott lesz, ahol a szerver is, hiszen ez a saját API-nk, nemde? Viszont így megkérdőjelezzük kicsit, hogy miért is erőltetjük az OAuth-ot. Csináljunk hát egy egyszerű kis klienst valahol máshol:

```
composer create-project laravel/laravel some-oauth-client
```

Ha nem akartok kézzel újabb vhostot felvenni, akkor [itt](https://github.com/RoverWire/virtualhost/blob/master/virtualhost.sh) egy jó kis shell script a linuxosoknak, amivel könnyedén lehet újat felvenni.

Ha ezzel megvolnánk, akkor hozzunk létre benne egy pofonegyszerű végpontot (mint kiderült annyira nem is lesz pofonegyszerű):

```
Route::get('/callback', function (\Illuminate\Http\Request $request) {

    \Auth::login($request->input("code"));

    return redirect("/home");
})->middleware("guest");
```

Na most itt mi is történik? A passportunk átirányít ide, a query paraméterek közt az `authorization code`-al. Ezt átadjuk az aktuális guard implementációnknak, az bejelentkeztet bennünket és ezután átirányítunk a `/home`-ra. Ha pedig már be vagyunk jelentkezve, akkor a guest middleware segítségével rögtön a `/home`-ra leszünk átirányítva. Egyszerűnek tűnik, igaz? Na de a bibi az, hogy a `Guard` implementációt biza nekünk kell megírni. A lényeg, amit itt akarunk, hogy összegyógyítsuk a Laravelt és a tokenünk életciklusát.

Először is nézzük meg, hogy mi történik, ha létrehozunk egy `/home` route-ot és ráeresztjük az `auth:web` middleware-t és odanavigálunk.

```
Route::get("/home", function(\Illuminate\Contracts\Auth\Guard $auth) {
    return $auth->user();
})->middleware("auth:web");
```

Bizony ő bennünket a `/login `végpontra fog átirányítani, amivel két bajunk is van. Egyik, hogy 404-et dob, a másik pedig az, hogy nekünk az lenne a jó, ha az OAuth bejelentkező oldalára irányítana, vagyis valami hasonlóra:

```
http://passport.localhost.hu/oauth/authorize?client_id=3&redirect_uri=http%3A%2F%2Foauth.localhost.hu%2Fcallback&response_type=code&scope=
```

Ahonnan a Passportos laravel persze a saját `/login` végpontjára majd átirányít minket, de ez más kérdés. Hol tudjuk ezt meghekkölni?

Bizony, itt kapunk egy `AuthenticationException`-t, amit elkap a mi kis Handlerünk, az` app\Exceptions\Handler.php`-ben és ő irányít át bennünket. Az itteni unauthenticated metódus végén cseréljük le az eddigi return-t erre:

```
$query = http_build_query([
    'client_id' => config("oauth.client_id"),
    'redirect_uri' => config("oauth.redirect_uri"),
    'response_type' => 'code',
    'scope' => '',
]);
return redirect('http://passport.localhost.hu/oauth/authorize?'.$query);
```

Ez felépíti nekünk a query stringet és redirectál a megfelelő helyre. Persze ehhez az kell, hogy a konfigba is beleírjunk. Hozzunk létre egy `config\oauth.php`-t:

```
return [
    "token_url" => 'http://passport.localhost.hu/oauth/token',
    "client_id" => 'CLIENT_ID',
    "user_url" => 'http://passport.localhost.hu/api/me',
    "redirect_uri" => 'http://oauth.localhost.hu/callback',
    "client_secret" =>  'SECRET',
];
```

Ezzel a tartalommal. Azt mostmár elértük, hogy a megfelelő helyre leszünk irányítva, ha nem vagyunk bejelentkezve, de meg kéne írni azt a logikát, ami elhiteti a laravellel, hogy mi be vagyunk jelentkezve. Ehhez létre kell hozni egy Guardot, ami legyen pl. az app\\Services\\Auth\\OauthGuard.php: ` `

Mielőtt bőszen elkezdenénk írni, be kell ezt regisztrálni, az A`uthServiceProvider`ünkben:

```
public function boot()
{
    $this->registerPolicies();

    \Auth::extend('oauth', function ($app, $name, array $config) {
        return new OauthGuard($app->make("session"), $app->make("config"));
    });
}
```

Átadjuk neki a `SessionManagert` és a `Configot` is. Jelenleg sessionben fogunk tárolni adatokat, de az implementáció változhat persze. Most, hogy létrehoztunk egy új Guardot, be is lehet regisztrálni a `config\auth.php`-ben:

```
'guards' => [
    'web' => [
        'driver' => 'oauth',
        'provider' => 'users',
    ],
```

Ha ezzel megvoltunk, akkor hozzuk létre magát az osztályt:

```
class OauthGuard implements Guard {

    private $session;
    private $config;

    private $OAUTH_USER_SESSION_KEY = "oauth_user";

    private $ACCESS_TOKEN_SESSION_KEY = "accessToken";

    private $EXPIRE_DATE_SESSION_KEY = "expireDate";

    private $REFRESH_TOKEN_SESSION_KEY = "refreshToken";

    public function __construct(SessionManager $session, Repository $config) {
        $this->session = $session;
        $this->config = $config;
    }
```

Akkor nézzük eddig mi is történt. Kielégítjük a konstruktort, amit meghatároztunk fentebb a providerben, valamint felvettünk pár változót, hogy a sok stringben ne keveredjünk el. Igen, implementáltuk az `Illuminate\Contracts\Auth\Guard` interfészt, tehát azokat a metódusokat meg kell valósítanunk.

```
/**
 * Validate a user's credentials.
 *
 * @param  array $credentials
 * @return bool
 */
public function validate(array $credentials = [])
{
    throw new NotImplementedException();
}
```

Az egyik ilyennel viszont rögtön kivételt dobatunk, mivel mi nem fogunk foglalkozni jelszavakkal.

```
/**
 * Set the current user.
 *
 * @param  \Illuminate\Contracts\Auth\Authenticatable $user
 * @return void
 */
public function setUser(Authenticatable $user)
{
    $this->session->put($this->OAUTH_USER_SESSION_KEY, $user);
}
```

Ez ahhoz lesz majd szükséges, hogy beállítsuk a user-t valami perzisztens helyre, itt szimplán az adott felhasználó sessionjében elhelyezzük szerializálva. Na de nézzük csak azt a logint!

```
public function login($code) {
    $tokenResponse = $this->getTokenResponse($code);

    $http = new Client();
    $response = $http->get($this->config->get("oauth.user_url"), [
        "headers" => [
            "Authorization" => "Bearer ". $tokenResponse->access_token
        ]
    ]);

    $userArray = json_decode((string)$response->getBody(), true);
    $user = new \App\User($userArray);
    $this->setCredentials($tokenResponse->access_token, $tokenResponse->refresh_token, $tokenResponse->expires_in);
    $this->setUser($user);
}
```

Láthatjuk, hogy első körben kimegyünk és a callbackben kapott kódot kicseréljük tokenekre. Ezután meglátogatjuk a user URL-t, ami szimplán lekérdezi a userünk alap információit. Ezt passport oldalon kell megírni, nem bonyolult:

```
Route::get('/me', function (Request $request) {
    return $request->user();
})->middleware('auth:api');
```

Ez ugye visszaadja a usert, amit a korábbi metódussal be is állítunk. A `setCredentials` beállítja sessionben a tokeneket és a lejárati időt is. Ha valami cache storeban tároljuk és nem sessionben, akkor nem szükséges a lejárati időt beállítani külön, hanem használhatjuk a tokenek esetében. Nézzük csak mi is történik ebben a `getTokenResponse`-ban!

```
public function getTokenResponse($code)
{
    $http = new Client();
    $response = $http->post($this->config->get("oauth.token_url"), [
        'form_params' => [
            'grant_type' => 'authorization_code',
            'client_id' => $this->config->get("oauth.client_id"),
            'client_secret' => $this->config->get("oauth.client_secret"),
            'redirect_uri' => $this->config->get("oauth.redirect_uri"),
            'code' => $code,
        ],
    ]);
    $responeObject = json_decode((string)$response->getBody());
    return $responeObject;
}
```

A helyzet ugyanaz, elmegyünk egy POST kéréssel a `token url`-re az `authorization_code`-al és kapunk cserébe tokeneket, amiket `stdClass` formájában visszaadunk.

```
private function setCredentials($accessToken, $refreshToken, $expires) {
    $this->session->put($this->ACCESS_TOKEN_SESSION_KEY, $accessToken);
    $this->session->put($this->REFRESH_TOKEN_SESSION_KEY, $refreshToken);
    $this->session->put($this->EXPIRE_DATE_SESSION_KEY, Carbon::now()->addSeconds($expires));
}
```

Itt állítjuk be a sessionbe az egyes kulcsok alá a tokeneket és a lejárati időt `Carbon` segítségével. Akkor jöjjön az egyik legfontosabb metódus, a `check`. Ez hívódik meg mikor arra kíváncsi a middleware, hogy tényleg be vagyunk-e jelentkezve:

```
/**
 * Determine if the current user is authenticated.
 *
 * @return bool
 */
public function check()
{
    return ($this->hasAccessToken() && $this->hasUser());
}
```

Bizony, megnézzük, hogy a sessionben szerepel-e a tokent, valamint hogy szerepel-e a user. Az utóbbi elég egyszerű:

```
public function hasUser() {
    return $this->session->has($this->OAUTH_USER_SESSION_KEY);
}
```

```
public function hasAccessToken() {
    if ($this->session->has($this->ACCESS_TOKEN_SESSION_KEY)) {
        if (Carbon::now() > $this->session->get($this->EXPIRE_DATE_SESSION_KEY)) {
            return $this->refreshToken();
        } else
            return true;
    } else
        return false;
}
```

Ha a tokent vizsgáljuk, akkor picit más a helyzet. Ellenőrízzuk, hogy egyáltalán megtalálható-e a sessionben, ha nem, akkor nincs token.

Gondolom lassan eljutunk ide:

![](https://media.tenor.co/images/d17c29b1437d7f77c685f79d6df0f298/raw)

Ha mégis, akkor megvizsgáljuk, hogy lejárt-e az a token. Ha nem járt le, akkor minden frankó. Ha viszont lejárt, akkor megpróbáljuk frissíteni azt a kapott refresh-tokennel és visszatérni azzal, hogy sikerült-e vagy sem.

```
public function refreshToken() {
    $responseObject = $this->getRefreshTokenResponse();
    if ($responseObject->getStatusCode() !== 200) {
        return false;
    }
    $tokenResponse = json_decode((string)$responseObject->getBody());
    $this->setCredentials($tokenResponse->access_token, $tokenResponse->refresh_token, $tokenResponse->expires_in);
    return true;
}
```

A refreshTokent hasonlóan állítjuk elő, minimálisan módosul a POST kérés az Oauth felé. Ha 200-as válasszal tér vissza, akkor a loginhoz hasonlóan mindent szépen beállítunk, ha viszont nem akkor `false`-al térünk vissza, tehát a `check` is azt látja majd, hogy biza itt nincs token.

```
public function getRefreshTokenResponse()
{
    $http = new Client();
    $tokenResponse = $http->post($this->config->get("oauth.token_url"), [
        'form_params' => [
            'grant_type' => 'refresh_token',
            'client_id' => $this->config->get("oauth.client_id"),
            'client_secret' => $this->config->get("oauth.client_secret"),
            'redirect_uri' => $this->config->get("oauth.redirect_uri"),
            'refresh_token' => $this->session->get("refreshToken"),
        ],
        "exceptions" => false
    ]);
    return $tokenResponse;
}
```

Látható, hogy itt nem code-ot, hanem refresh\_tokent adunk át és ennek az eredményével térünk vissza. Az egész folyamat kb. így néz ki:

[![](assets/uploads/2017/01/Selection_091.png)](assets/uploads/2017/01/Selection_091.png)

Az interfész viszont megkövetel még pár metódust:

```
/**
 * Determine if the current user is a guest.
 *
 * @return bool
 */
public function guest()
{
    return !$this->check();
}
```

Ez igazából a fordítottja a check-nek, arra vagyunk kíváncsiak, hogy az aktuális felhasználó vendégként van-e jelen.

```
/**
 * Get the currently authenticated user.
 *
 * @return \Illuminate\Contracts\Auth\Authenticatable|null
 */
public function user()
{
    return $this->session->get($this->OAUTH_USER_SESSION_KEY);
}
```

Ez a metódus adja vissza a bejelentkezett felhasználót, ez utóbbi pedig annak az ID-ját:

```
/**
 * Get the ID for the currently authenticated user.
 *
 * @return int|null
 */
public function id()
{
    return $this->session->get($this->OAUTH_USER_SESSION_KEY)->id;
}
```

Na most eljutottunk oda, hogyha belépünk, akkor rendesen megkapjuk a tokenünket és egy middleware-el megoldható az authentikáció. Nézzük meg, hogy mit is tudunk kezdeni mindezzel:

```
/**
 * Returns the currently authenticated users token
 * @return string
 */
public function getToken() {
    return $this->session->get($this->ACCESS_TOKEN_SESSION_KEY);
}
```

Adjunk hozzá egy új metódust a Guardunkhoz, ezáltal könnyedén hozzáférünk az access\_tokenünkhöz a későbbiekben. De vajon tényleg jól jelentkeztünk be? Tényleg minket lát a Laravel? Derítsük ki!

```
Route::get('/', function () {
})->middleware("guest", "auth:web");

Route::get("/home", function(\Illuminate\Contracts\Auth\Guard $auth) {
    return $auth->user();
})->middleware("auth:web");
```

Vegyük fel a két fenti route-ot. Az első ugye átirányít a /home-ra, ha be vagyunk jelentkezve. Mindekettő redirektál a passportos URL-re, amit korábban megadtunk, ha nem vagyunk bejelentkezve. A /home pedig nem csinál mást, mint a Guardunktól kikéri az épp bejelentkezett usert és kiírja JSON formátumban. Nézzük:

[![](assets/uploads/2017/01/Selection_092.png)](assets/uploads/2017/01/Selection_092.png)

Tádám, működik! Tehát, hogy teljesen tiszta legyen:

Mikor odanavigálunk a kliensünk gyökerében a `/`-re. Akkor látja, hogy nem vagyunk bejelentkezve és átirányít minket a passportos URL-re. Ott belépünk, az pedig visszairányít minket az itteni `/callback`-re, a szükséges kóddal, amit a `Guard` fel is használ és lecseréli egy tokenre, valamint lekéri a userünk alap adatait és letárolja őket sessionben. Ezután redirektál minket a `/home` URL-re, ami ellenőrzi, hogy be vagyunk-e lépve. Ha igen, akkor JSON-ben kiírja az imént kapott userünket. Sima ügy, ugye?

A kód [itt](https://github.com/letscodehu/passporticus) található.

Mivel nem terveztem, hogy implementációt is írok a klienshez, lévén vannak hasonlók, talán még jobbak is (max nem egyszerűbbek), ezért a scope-okat egy következő cikkben próbáljuk ki, szintén Passport segítségével!