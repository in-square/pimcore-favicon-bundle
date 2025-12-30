# Plan realizacji

1. Przejrzec strukture bundla i istniejace konfiguracje (services, config, routing) pod katem miejsca na nowe ustawienia.
   - Sprawdzic, gdzie bundle trzyma definicje serwisow i jak laduje konfiguracje (np. `Extension`, `Resources/config`).
   - Zweryfikowac, czy sa juz wzorce dla ustawien admina, Twig lub event subscriberow.
   - Zidentyfikowac docelowe sciezki publiczne (czy bundle ma publikuje assets lub korzysta z `/public` hosta).
2. Dodac ustawienie systemowe w Pimcore na upload faviconu wraz z walidacja typu/rozmiaru i powiazanym ACL.
   - Zdefiniowac pole w "System Settings" jako upload/asset image (np. klucz `favicon_source`).
   - Dodac walidacje: dozwolone typy (png/jpg) i minimalny rozmiar (min 192x192) oraz sensowny limit wagi.
   - Zarejestrowac uprawnienie w ACL (np. `favicon_settings`) i podpiac je do widocznosci edycji tego pola.
3. Zaimplementowac serwis generujacy zestaw ikon oraz manifest.json i zapisujacy pliki do `/public/favicon`.
   - Dodac serwis `FaviconGenerator` przyjmujacy sciezke do obrazu z system settings i katalog docelowy.
   - Uzyc API obrazkow Pimcore (adapter GD/Imagick) do resize i zapisu PNG w rozmiarach: 16, 32, 36, 48, 57, 60, 72, 76, 96, 114, 120, 144, 152, 180, 192.
   - Ustalic nazwy plikow zgodne z wymaganiami (apple-icon-*.png, android-icon-*.png, favicon-*.png, ms-icon-144x144.png).
   - Wygenerowac `manifest.json` przez `json_encode` (pretty + unescaped slashes) z lista ikon i ich "density"; manifest ma zawierac rowniez ikony 36x36 i 48x48.
4. Podlaczyc proces generowania do zapisu ustawienia (hook/observer) i zapewnic odswiezenie plikow po zmianie.
   - Dodac event subscriber / listener na zapis System Settings i sprawdzic, czy zmieniono `favicon_source`.
   - Na zmianie pobrac plik z assetu (filesystem path) i wywolac `FaviconGenerator`.
   - Przy usunieciu ustawienia wyczyscic `/public/favicon` albo zostawic poprzednie pliki i logowac ostrzezenie (do ustalenia).
5. Dodac rozszerzenie Twig z funkcja `render_favicon()` zwracajaca zestaw tagow HTML zgodny z wymaganiami.
   - Zaimplementowac `Twig\Extension\AbstractExtension` z funkcja `render_favicon` oznaczona jako `is_safe => ['html']`.
   - Zbudowac HTML z lista `<link>` i `<meta>` wg wzoru, bazujac na `asset()` albo `Packages` Symfony.
   - Dodac prosty guard: jesli brak plikow w `/public/favicon` lub brak ustawienia, zwrocic pusty string.
6. Dodac minimalna dokumentacje i sprawdzenia (np. brak plikow, fallback) oraz smoke test w panelu.
   - Dodac opis w `README` bundla: jak ustawic favicon, jakie rozmiary sa generowane i jak uzyc `render_favicon()`.
   - Dodac krotka notke o ACL i wymaganiach obrazu zrodlowego.
   - Przeprowadzic smoke test w panelu: upload, zapis, wygenerowane pliki w `/public/favicon`, render w Twig.
