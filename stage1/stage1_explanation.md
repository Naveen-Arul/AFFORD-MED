# Stage 1

## Goal

Fetch notifications from the protected evaluation API and compute the top 10 priority notifications based on a mix of type (Placement>Result>Event) and recency.

## Priority approach

- We assign weights to types:
  - Placement = 3
  - Result = 2
  - Event = 1

- For each notification we compute a numeric score:

  priorityScore = (typeWeight * 1e13) + timestampMillis

  This makes type dominant (higher weight always outranks recency) while recency orders notifications of the same type.

## Efficient maintenance of Top 10

- For continuous streams you can maintain a fixed-size min-heap of size N (10) where you push new items and pop the smallest when size > N. This keeps insertion O(log N) and memory O(N).

- For this assessment (one-off calculation) we fetch, score, sort and slice top 10. Sort is O(M log M) where M is number of notifications returned; acceptable for moderate M.

## Logging

- All operations use the provided `logging-middleware` (`logging-middleware/index.js`). Calls are made to `Log(stack, level, packageName, message)` so logs are forwarded to the evaluation service.

## How to run

1. Ensure you have Node.js installed.
2. From the repository root run (example uses the saved backend `.env` token):

```bash
cd stage1
node getTopNotifications.js --top=10
```

If `ACCESS_TOKEN` is not set, pass `--token="<ACCESS_TOKEN>"`.

## Outputs

- Console prints the top 10 notifications in priority order.
- `stage1/output_stage1.json` contains the same data for easy screenshotting.

## Files

- `getTopNotifications.js` — runner script that fetches notifications and prints top N.
- `priorityHelper.js` — scoring helper (weights + timestamp combination).
- `stage1_explanation.md` — this design/explanation.

## Notes

- The script intentionally keeps scoring logic simple and explainable. For real-time streams, replace sorting with a bounded min-heap.
- Keep your `ACCESS_TOKEN` secret; `.env` is included in `.gitignore`.
