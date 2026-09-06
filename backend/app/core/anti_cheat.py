import json
from typing import List, Tuple, Optional
import math

def validate_keystrokes(
    wpm: float,
    duration: float,
    keystrokes_json: Optional[str]
) -> Tuple[bool, str]:
    """
    Validates typing test performance against realistic human biometric constraints.
    """
    # Sanity checks
    if wpm < 0 or wpm > 320:
        return False, "WPM out of credible human range (> 320 WPM)"
    
    if duration <= 0:
        return False, "Invalid test duration"

    if not keystrokes_json:
        # If no detailed keystroke log provided, fallback to basic heuristic
        return True, "Valid (basic check)"
    
    try:
        data = json.loads(keystrokes_json)
        # Expecting list of [key, timestamp_ms] or dict with timestamps
        if not isinstance(data, list) or len(data) < 5:
            return True, "Valid (insufficient keystroke samples)"
        
        timestamps = []
        for item in data:
            if isinstance(item, list) and len(item) >= 2 and isinstance(item[1], (int, float)):
                timestamps.append(item[1])
            elif isinstance(item, dict) and "time" in item:
                timestamps.append(item["time"])
        
        if len(timestamps) < 5:
            return True, "Valid"
        
        # Calculate intervals
        intervals = [timestamps[i] - timestamps[i - 1] for i in range(1, len(timestamps))]
        
        # Remove negative or zero intervals (can happen with lag or key rollover, but sustained 0ms is bot)
        zero_intervals = sum(1 for delta in intervals if delta <= 2)
        if zero_intervals > len(intervals) * 0.4:
            return False, "Unnatural keystroke clustering detected (possible paste or bot script)"
            
        avg_interval = sum(intervals) / len(intervals)
        if avg_interval < 25: # < 25ms per key corresponds to > 480 WPM
            return False, "Superhuman keystroke frequency detected"
            
        # Standard deviation check (bots often type with exact constant intervals)
        variance = sum((x - avg_interval) ** 2 for x in intervals) / len(intervals)
        std_dev = math.sqrt(variance)
        
        if std_dev < 1.0 and len(intervals) > 20:
            return False, "Unnatural constant typing speed detected (bot pattern)"
            
        return True, "Valid"

    except Exception:
        # Fail open for parsing issues so users aren't unfairly blocked
        return True, "Valid (unparseable metadata)"
