export default async function ({ $echo }) {
  if ($echo.options.broadcaster !== $echo.config.broadcaster) {
    $echo.options.broadcaster = $echo.config.broadcaster
    await $echo.connect()
  }
}
