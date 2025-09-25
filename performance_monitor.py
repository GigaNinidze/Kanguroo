import time
from typing import Dict, List, Any
from collections import defaultdict, deque

class PerformanceMonitor:
    def __init__(self, max_requests: int = 1000):
        self.max_requests = max_requests
        self.requests = deque(maxlen=max_requests)
        self.user_stats = defaultdict(lambda: {
            'total_requests': 0,
            'successful_requests': 0,
            'total_gemini_time': 0,
            'total_tts_time': 0,
            'total_response_length': 0,
            'errors': []
        })
        self.request_counter = 0
    
    def start_request(self, user_id: str) -> str:
        """Start tracking a new request"""
        self.request_counter += 1
        request_id = f"req_{self.request_counter}_{int(time.time())}"
        
        request_data = {
            'request_id': request_id,
            'user_id': user_id,
            'start_time': time.time(),
            'status': 'started'
        }
        
        self.requests.append(request_data)
        return request_id
    
    def record_metrics(self, request_id: str, user_id: str, gemini_time: float, 
                      tts_time: float, success: bool, response_length: int, 
                      error: str = None):
        """Record performance metrics for a completed request"""
        # Update user stats
        user_stats = self.user_stats[user_id]
        user_stats['total_requests'] += 1
        if success:
            user_stats['successful_requests'] += 1
        user_stats['total_gemini_time'] += gemini_time
        user_stats['total_tts_time'] += tts_time
        user_stats['total_response_length'] += response_length
        
        if error:
            user_stats['errors'].append({
                'timestamp': time.time(),
                'error': error
            })
        
        # Update request data
        for request in self.requests:
            if request['request_id'] == request_id:
                request.update({
                    'gemini_time': gemini_time,
                    'tts_time': tts_time,
                    'total_time': gemini_time + tts_time,
                    'success': success,
                    'response_length': response_length,
                    'end_time': time.time(),
                    'status': 'completed',
                    'error': error
                })
                break
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get comprehensive performance statistics"""
        if not self.requests:
            return {
                'total_requests': 0,
                'average_response_time': 0,
                'success_rate': 0,
                'average_gemini_time': 0,
                'average_tts_time': 0
            }
        
        # Calculate overall stats
        completed_requests = [r for r in self.requests if r.get('status') == 'completed']
        total_requests = len(completed_requests)
        
        if total_requests == 0:
            return {
                'total_requests': 0,
                'average_response_time': 0,
                'success_rate': 0,
                'average_gemini_time': 0,
                'average_tts_time': 0
            }
        
        successful_requests = [r for r in completed_requests if r.get('success', False)]
        success_rate = len(successful_requests) / total_requests * 100
        
        # Calculate average times
        total_gemini_time = sum(r.get('gemini_time', 0) for r in completed_requests)
        total_tts_time = sum(r.get('tts_time', 0) for r in completed_requests)
        total_response_time = sum(r.get('total_time', 0) for r in completed_requests)
        
        avg_gemini_time = total_gemini_time / total_requests
        avg_tts_time = total_tts_time / total_requests
        avg_response_time = total_response_time / total_requests
        
        return {
            'total_requests': total_requests,
            'successful_requests': len(successful_requests),
            'success_rate': round(success_rate, 2),
            'average_response_time': round(avg_response_time, 2),
            'average_gemini_time': round(avg_gemini_time, 2),
            'average_tts_time': round(avg_tts_time, 2),
            'total_gemini_time': round(total_gemini_time, 2),
            'total_tts_time': round(total_tts_time, 2),
            'user_stats': dict(self.user_stats)
        }
    
    def get_recent_requests(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent requests for monitoring"""
        return list(self.requests)[-limit:]
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for a specific user"""
        return dict(self.user_stats.get(user_id, {}))
    
    def clear_old_data(self, max_age_seconds: int = 3600):
        """Clear old request data to prevent memory issues"""
        current_time = time.time()
        cutoff_time = current_time - max_age_seconds
        
        # Remove old requests
        self.requests = deque(
            [r for r in self.requests if r.get('start_time', 0) > cutoff_time],
            maxlen=self.max_requests
        )
        
        # Clean up old errors in user stats
        for user_id, stats in self.user_stats.items():
            stats['errors'] = [
                error for error in stats['errors'] 
                if error.get('timestamp', 0) > cutoff_time
            ]

# Global performance monitor instance
performance_monitor = PerformanceMonitor()
