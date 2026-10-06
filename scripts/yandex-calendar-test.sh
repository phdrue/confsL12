#!/usr/bin/env bash
# Create or delete a CalDAV event in Yandex Calendar (app password auth).
#
# Required:
#   YANDEX_APP_PASSWORD   Calendar / CalDAV app password
#
# Optional:
#   YANDEX_EMAIL          default: ksmu.dns@yandex.ru
#   YANDEX_CALENDAR_PATH  default: events-388516218900156
#   CONF_TYPE             default: Научная конференция   -> CATEGORIES (conference_types.name)
#   CONF_START            default: +7 days (YYYYMMDD)    -> DTSTART (proposal payload.date, fallback conferences.date)
#   CONF_END              default: = CONF_START          -> DTEND   (proposal payload.endDate, fallback conferences.date; inclusive)
#   CONF_URL              default: APP_URL/conferences/1 -> URL (route conferences.show)
#
# Field mapping (conference -> calendar event):
#   UID          conf-{conferences.id}@<app host>
#   SUMMARY      conferences.name
#   DESCRIPTION  conferences.description
#   CATEGORIES   conference_types.name (conferences.type_id)
#   DTSTART      proposal.payload.date, else conferences.date   (all-day)
#   DTEND        proposal.payload.endDate (else conferences.date) + 1 day (iCal DTEND is exclusive)
#   URL          route('conferences.show', conference) - public page
#   LOCATION     not stored on conference (proposal payload organization, optional)
#
# Usage:
#   export YANDEX_APP_PASSWORD='xxxx-xxxx-xxxx-xxxx'
#   bash scripts/yandex-calendar-test.sh              # create dummy event
#   bash scripts/yandex-calendar-test.sh --delete <event_uid>
#
# Create app password:
#   https://id.yandex.ru/security/app-passwords  → Calendar / CalDAV

set -euo pipefail

EMAIL="${YANDEX_EMAIL:-ksmu.dns@yandex.ru}"
CAL_PATH="${YANDEX_CALENDAR_PATH:-events-388516218900156}"
APP_PASSWORD="${YANDEX_APP_PASSWORD:-}"
PUBLIC_URL="https://calendar.yandex.ru/embed/week?layer_ids=388516218900156&layer_names=%D1%82%D0%B5%D1%81%D1%82&tz_id=Europe%2FMoscow&uid=1130000072313843"

MODE="create"
EVENT_UID=""

usage() {
  cat <<'EOF'
Usage:
  bash scripts/yandex-calendar-test.sh
  bash scripts/yandex-calendar-test.sh --delete <event_uid>

Env:
  YANDEX_APP_PASSWORD   required
  YANDEX_EMAIL          optional
  YANDEX_CALENDAR_PATH  optional
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --delete|-d)
      MODE="delete"
      if [[ $# -lt 2 || "$2" == -* ]]; then
        echo "Missing event uid after --delete" >&2
        usage >&2
        exit 1
      fi
      EVENT_UID="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$APP_PASSWORD" ]]; then
  cat >&2 <<'EOF'
Set YANDEX_APP_PASSWORD first.

  1) Open https://id.yandex.ru/security/app-passwords
  2) Create password for "Calendar" / CalDAV
  3) export YANDEX_APP_PASSWORD='the-password'
  4) bash scripts/yandex-calendar-test.sh
EOF
  exit 1
fi

EMAIL_ENC="${EMAIL//@/%40}"
CAL_BASE="https://caldav.yandex.ru/calendars/${EMAIL_ENC}/${CAL_PATH}"
AUTH=(-u "${EMAIL}:${APP_PASSWORD}")

put_event() {
  local url="$1"
  local ics="$2"
  local code

  code="$(curl -sS -o /tmp/yandex-caldav-response.txt -w '%{http_code}' \
    -X PUT "${url}" \
    "${AUTH[@]}" \
    -H 'Content-Type: text/calendar; charset=utf-8' \
    --data-binary "${ics}")"

  if [[ "$code" != "201" && "$code" != "200" && "$code" != "204" ]]; then
    code="$(curl -sS -o /tmp/yandex-caldav-response.txt -w '%{http_code}' \
      -X PUT "${url}" \
      "${AUTH[@]}" \
      -H 'Content-Type: text/ics' \
      --data-binary "${ics}")"
  fi

  echo "$code"
}

if [[ "$MODE" == "delete" ]]; then
  EVENT_URL="${CAL_BASE}/${EVENT_UID}.ics"
  echo "==> Deleting event ${EVENT_UID}..."
  HTTP_CODE="$(curl -sS -o /tmp/yandex-caldav-response.txt -w '%{http_code}' \
    -X DELETE "${EVENT_URL}" \
    "${AUTH[@]}")"
  echo "HTTP ${HTTP_CODE}"
  if [[ -s /tmp/yandex-caldav-response.txt ]]; then
    echo "Body:"
    cat /tmp/yandex-caldav-response.txt
    echo
  fi
  if [[ "$HTTP_CODE" != "200" && "$HTTP_CODE" != "204" ]]; then
    echo "Delete failed." >&2
    exit 1
  fi
  echo "Deleted: ${EVENT_URL}"
  exit 0
fi

EVENT_UID="test-$(date +%s)"
CONF_TYPE="${CONF_TYPE:-Научная конференция}"
CONF_URL="${CONF_URL:-https://example.com/conferences/1}"
START_DATE="${CONF_START:-$(date -u -d '+7 days' +%Y%m%d 2>/dev/null || date -u -v+7d +%Y%m%d)}"
LAST_DAY="${CONF_END:-$START_DATE}"
END_DATE="$(date -u -d "${LAST_DAY} +1 day" +%Y%m%d 2>/dev/null || date -u -v+1d -j -f %Y%m%d "${LAST_DAY}" +%Y%m%d)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
EVENT_URL="${CAL_BASE}/${EVENT_UID}.ics"

ICS="$(cat <<EOF
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//confsL12//Test//EN
BEGIN:VEVENT
UID:${EVENT_UID}
DTSTAMP:${STAMP}
DTSTART;VALUE=DATE:${START_DATE}
DTEND;VALUE=DATE:${END_DATE}
SUMMARY:Test conference from API
DESCRIPTION:Dummy event for CalDAV push test
LOCATION:Test hall
CATEGORIES:${CONF_TYPE}
URL:${CONF_URL}
END:VEVENT
END:VCALENDAR
EOF
)"

echo "==> Auth: app password for ${EMAIL}"
echo "==> Creating event ${EVENT_UID} (${START_DATE} -> ${END_DATE})..."
HTTP_CODE="$(put_event "${EVENT_URL}" "${ICS}")"
echo "HTTP ${HTTP_CODE}"
if [[ -s /tmp/yandex-caldav-response.txt ]]; then
  echo "Body:"
  cat /tmp/yandex-caldav-response.txt
  echo
fi

if [[ "$HTTP_CODE" != "201" && "$HTTP_CODE" != "200" && "$HTTP_CODE" != "204" ]]; then
  echo "Event create failed." >&2
  exit 1
fi

echo "==> Reading event back..."
curl -sS -D - "${EVENT_URL}" \
  "${AUTH[@]}" \
  -o /tmp/yandex-caldav-event.ics
echo
echo "----- event body -----"
cat /tmp/yandex-caldav-event.ics
echo
echo "----------------------"
echo
echo "Public preview (open incognito, go to week of ${START_DATE}):"
echo "${PUBLIC_URL}"
echo
echo "Event UID: ${EVENT_UID}"
echo "Event URL: ${EVENT_URL}"
echo "Delete with:"
echo "  bash scripts/yandex-calendar-test.sh --delete ${EVENT_UID}"
