#!/bin/bash
# Database backup script for production

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="je_me_defends"

echo "📦 Creating database backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
docker-compose -f deployment/docker/docker-compose.prod.yml exec -T postgres \
    pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

echo "✅ Backup created: $BACKUP_DIR/db_backup_$DATE.sql.gz"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "🧹 Old backups cleaned up (kept last 30 days)"

# ============ scripts/monitor-logs.sh ============
#!/bin/bash
# Log monitoring script with alerts

set -e

LOG_FILE="${1:-logs/app.log}"
ALERT_KEYWORDS=("ERROR" "CRITICAL" "EXCEPTION" "FAILED")

echo "📊 Monitoring logs: $LOG_FILE"
echo "🚨 Alert keywords: ${ALERT_KEYWORDS[*]}"
echo "Press Ctrl+C to stop"
echo "=========================="

# Function to send alert (customize as needed)
send_alert() {
    local message="$1"
    echo "🚨 ALERT: $message"
    # Add your alerting logic here (email, Slack, etc.)
}

# Monitor log file
tail -f "$LOG_FILE" | while read -r line; do
    echo "$line"

    # Check for alert keywords
    for keyword in "${ALERT_KEYWORDS[@]}"; do
        if echo "$line" | grep -q "$keyword"; then
            send_alert "Found $keyword in logs: $line"
            break
        fi
    done

    # Check for high error rates (simple implementation)
    if echo "$line" | grep -q '"level": "ERROR"'; then
        error_count=$(tail -100 "$LOG_FILE" | grep -c '"level": "ERROR"' || echo 0)
        if [ "$error_count" -gt 10 ]; then
            send_alert "High error rate detected: $error_count errors in last 100 log entries"
        fi
    fi
done