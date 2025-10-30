<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet" />

    <script>
        window.gtranslateSettings = {
            "default_language": "ru",
            "detect_browser_language": true,
            "native_language_names": true,
            "languages": ["ru", "be", "en", "uz", "tg", "ky"],
            "wrapper_selector": ".gtranslate_wrapper",
            "switcher_horizontal_position": "right"
        }
    </script>
    <script src="https://cdn.gtranslate.net/widgets/latest/dwf.js" defer></script>
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="prefe font-sans antialiased">
    @include('cookie-consent::index')
    @inertia
    <div class="gtranslate_wrapper"></div>
</body>

</html>
