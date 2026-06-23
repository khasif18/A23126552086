import java.util.*;
import java.time.*;

public class NotificationPriorityBox {

    enum Type {
        PLACEMENT, RESULT, EVENT
    }

    static class Notification {
        String id;
        Type type;
        String message;
        long createdAtMillis;
        boolean isRead;

        Notification(String id, Type type, String message, long createdAtMillis, boolean isRead) {
            this.id = id;
            this.type = type;
            this.message = message;
            this.createdAtMillis = createdAtMillis;
            this.isRead = isRead;
        }

        long priorityScore() {
            long typeWeight = switch (type) {
                case PLACEMENT -> 3_000_000_000L;
                case RESULT -> 2_000_000_000L;
                case EVENT -> 1_000_000_000L;
            };
            return typeWeight + createdAtMillis;
        }

        @Override
        public String toString() {
            return "Notification{" +
                    "id='" + id + '\'' +
                    ", type=" + type +
                    ", message='" + message + '\'' +
                    ", createdAt=" + Instant.ofEpochMilli(createdAtMillis) +
                    ", isRead=" + isRead +
                    ", score=" + priorityScore() +
                    '}';
        }
    }

    public static List<Notification> findTop10Unread(List<Notification> notifications) {
        PriorityQueue<Notification> minHeap = new PriorityQueue<>(Comparator.comparingLong(Notification::priorityScore));

        for (Notification n : notifications) {
            if (n.isRead) continue;

            if (minHeap.size() < 10) {
                minHeap.offer(n);
            } else if (n.priorityScore() > minHeap.peek().priorityScore()) {
                minHeap.poll();
                minHeap.offer(n);
            }
        }

        List<Notification> result = new ArrayList<>(minHeap);
        result.sort((a, b) -> Long.compare(b.priorityScore(), a.priorityScore()));
        return result;
    }

    static class Top10Maintainer {
        private final PriorityQueue<Notification> minHeap =
                new PriorityQueue<>(Comparator.comparingLong(Notification::priorityScore));

        public void add(Notification n) {
            if (n.isRead) return;

            if (minHeap.size() < 10) {
                minHeap.offer(n);
            } else if (n.priorityScore() > minHeap.peek().priorityScore()) {
                minHeap.poll();
                minHeap.offer(n);
            }
        }

        public List<Notification> getTop10() {
            List<Notification> result = new ArrayList<>(minHeap);
            result.sort((a, b) -> Long.compare(b.priorityScore(), a.priorityScore()));
            return result;
        }
    }

    public static void main(String[] args) {
        long now = System.currentTimeMillis();

        List<Notification> notifications = Arrays.asList(
                new Notification("1", Type.EVENT, "Coding club meetup", now - 900000, false),
                new Notification("2", Type.PLACEMENT, "Amazon shortlisted candidates", now - 300000, false),
                new Notification("3", Type.RESULT, "Mid sem results published", now - 600000, false),
                new Notification("4", Type.EVENT, "Hackathon starts tomorrow", now - 120000, false),
                new Notification("5", Type.PLACEMENT, "Microsoft test link shared", now - 1000000, false),
                new Notification("6", Type.RESULT, "Revaluation portal opened", now - 200000, true),
                new Notification("7", Type.PLACEMENT, "Google interview schedule", now - 200000, false),
                new Notification("8", Type.EVENT, "Workshop registration open", now - 50000, false),
                new Notification("9", Type.RESULT, "Final year project review results", now - 70000, false),
                new Notification("10", Type.PLACEMENT, "Placement orientation", now - 1500000, false),
                new Notification("11", Type.EVENT, "Sports day announcement", now - 20000, false),
                new Notification("12", Type.RESULT, "Lab results uploaded", now - 250000, false),
                new Notification("13", Type.PLACEMENT, "TCS hiring update", now - 80000, false)
        );

        System.out.println("Top 10 unread notifications:");
        List<Notification> top10 = findTop10Unread(notifications);
        for (Notification n : top10) {
            System.out.println(n);
        }

        System.out.println("\nStreaming update demo:");
        Top10Maintainer maintainer = new Top10Maintainer();
        for (Notification n : notifications) {
            maintainer.add(n);
        }

        Notification incoming = new Notification(
                "14",
                Type.PLACEMENT,
                "New urgent placement drive announced",
                now,
                false
        );

        maintainer.add(incoming);

        System.out.println("Top 10 after new notification:");
        for (Notification n : maintainer.getTop10()) {
            System.out.println(n);
        }
    }
}